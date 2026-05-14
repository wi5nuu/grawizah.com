package middleware

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client

func init() {
	redisURL := os.Getenv("UPSTASH_REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}
	
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		fmt.Printf("Warning: Failed to parse Redis URL: %v\n", err)
		rdb = redis.NewClient(&redis.Options{
			Addr: "localhost:6379",
		})
	} else {
		rdb = redis.NewClient(opts)
	}
}

func checkRateLimit(ctx context.Context, key string, limit int, window time.Duration) bool {
	if rdb == nil {
		return true // Fail open if Redis is not configured
	}

	count, err := rdb.Incr(ctx, key).Result()
	if err != nil {
		fmt.Printf("Redis error: %v\n", err)
		return true // Fail open on error
	}

	if count == 1 {
		rdb.Expire(ctx, key, window)
	}

	return int(count) <= limit
}

// RateLimitMiddleware limits requests per IP
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

// AIRateLimitMiddleware limits AI endpoint requests
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

		userID, _ := c.Get("user_id")
		key := fmt.Sprintf("rate_limit:ai:%s", userID.(string))

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
