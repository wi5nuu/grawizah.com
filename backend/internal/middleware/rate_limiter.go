package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// ── Metrics counters (atomic — safe for concurrent access) ─────────────────
var (
	metricRedisErrors  atomic.Int64 // incremented on every Redis failure
	metricBlocked      atomic.Int64 // incremented when a request is blocked
	metricAllowed      atomic.Int64 // incremented when a request is allowed
)

// GetRateLimitMetrics returns current metric snapshot for health/monitoring endpoints.
func GetRateLimitMetrics() map[string]int64 {
	return map[string]int64{
		"rate_limit_redis_errors": metricRedisErrors.Load(),
		"rate_limit_blocked":      metricBlocked.Load(),
		"rate_limit_allowed":      metricAllowed.Load(),
	}
}

// ── In-memory fallback limiter (used in dev or when Redis is unavailable) ───
// Tracks request counts per key with a simple time-bucketed counter.
type memBucket struct {
	count  int
	resetAt time.Time
}

var (
	memLimiter   sync.Map          // map[string]*memBucket
	memLimiterMu sync.Mutex        // guards bucket creation
)

func checkMemoryRateLimit(key string, limit int, window time.Duration) bool {
	memLimiterMu.Lock()
	defer memLimiterMu.Unlock()

	now := time.Now()
	val, _ := memLimiter.LoadOrStore(key, &memBucket{resetAt: now.Add(window)})
	bucket := val.(*memBucket)

	if now.After(bucket.resetAt) {
		bucket.count = 0
		bucket.resetAt = now.Add(window)
	}

	bucket.count++
	return bucket.count <= limit
}

// ── Redis client ─────────────────────────────────────────────────────────────
var rdb *redis.Client

func init() {
	redisURL := os.Getenv("UPSTASH_REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}

	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		log.Printf("⚠️  [RateLimit] Failed to parse Redis URL: %v — in-memory fallback active", err)
		return
	}

	rdb = redis.NewClient(opts)

	// Startup health check
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("⚠️  [RateLimit] Redis ping failed at startup: %v — in-memory fallback active", err)
		// Don't nil out rdb — let checkRateLimit handle errors at request-time
	} else {
		log.Println("✅ [RateLimit] Redis connected successfully")
	}
}

// checkRateLimit is the core rate-limit decision function.
//
// [H-05] Fail strategy:
//   - PRODUCTION (GO_ENV=production): fail-closed — Redis error → block request
//   - DEVELOPMENT: fail-open via in-memory fallback limiter
//
// This ensures DDoS protection is never silently disabled in production.
func checkRateLimit(ctx context.Context, key string, limit int, window time.Duration) bool {
	isProduction := os.Getenv("GO_ENV") == "production"

	if rdb == nil {
		// Redis not configured at all
		if isProduction {
			log.Printf("❌ [RateLimit] Redis not configured in production — fail-closed for key: %s", key)
			metricRedisErrors.Add(1)
			metricBlocked.Add(1)
			return false
		}
		// Dev: use in-memory fallback
		allowed := checkMemoryRateLimit(key, limit, window)
		if allowed {
			metricAllowed.Add(1)
		} else {
			metricBlocked.Add(1)
		}
		return allowed
	}

	count, err := rdb.Incr(ctx, key).Result()
	if err != nil {
		metricRedisErrors.Add(1)

		if isProduction {
			// [H-05] FAIL CLOSED in production — never let DDoS protection drop silently
			log.Printf("❌ [RateLimit] Redis error in production — fail-closed for key %s: %v", key, err)
			metricBlocked.Add(1)
			return false
		}

		// Dev: fall back to in-memory limiter so development isn't blocked
		log.Printf("⚠️  [RateLimit] Redis error — switching to in-memory fallback: %v", err)
		allowed := checkMemoryRateLimit(key, limit, window)
		if allowed {
			metricAllowed.Add(1)
		} else {
			metricBlocked.Add(1)
		}
		return allowed
	}

	if count == 1 {
		// Set expiry on first increment — ignore error (non-critical)
		rdb.Expire(ctx, key, window)
	}

	allowed := int(count) <= limit
	if allowed {
		metricAllowed.Add(1)
	} else {
		metricBlocked.Add(1)
	}
	return allowed
}

// RateLimitMiddleware limits requests per client IP address.
func RateLimitMiddleware(limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := fmt.Sprintf("rate_limit:ip:%s", ip)

		if !checkRateLimit(c.Request.Context(), key, limit, window) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":       "Rate limit exceeded",
				"retry_after": window.Seconds(),
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// AIRateLimitMiddleware limits AI endpoint requests per user.
// Premium traders bypass this limit entirely.
func AIRateLimitMiddleware() gin.HandlerFunc {
	limit := 3
	window := 24 * time.Hour

	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		// Premium users bypass rate limit
		if userRole == "premium_trader" {
			c.Next()
			return
		}

		userID, ok := c.Get("user_id")
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID missing from token"})
			c.Abort()
			return
		}

		key := fmt.Sprintf("rate_limit:ai:%v", userID)

		if !checkRateLimit(c.Request.Context(), key, limit, window) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Daily AI request limit exceeded",
				"message": "Upgrade to Premium for unlimited access",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
