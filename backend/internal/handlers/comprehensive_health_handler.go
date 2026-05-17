package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
	"github.com/redis/go-redis/v9"
)

var startTime = time.Now()

type ComprehensiveHealthHandler struct {
	db        *sql.DB
	aiService *services.AIService
}

func NewComprehensiveHealthHandler(db *sql.DB, aiService *services.AIService) *ComprehensiveHealthHandler {
	return &ComprehensiveHealthHandler{
		db:        db,
		aiService: aiService,
	}
}

func (h *ComprehensiveHealthHandler) Check(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	// 1. Check Database
	dbStatus := "healthy"
	if h.db == nil {
		dbStatus = "unhealthy: database connection is uninitialized (nil)"
	} else if err := h.db.PingContext(ctx); err != nil {
		dbStatus = "unhealthy: " + err.Error()
	}

	// 2. Check Redis
	redisStatus := "healthy"
	redisURL := os.Getenv("UPSTASH_REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379/0"
	}
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		redisStatus = "unhealthy: invalid url"
	} else {
		rdb := redis.NewClient(opts)
		defer rdb.Close()
		if err := rdb.Ping(ctx).Err(); err != nil {
			redisStatus = "unhealthy: " + err.Error()
		}
	}

	// 3. Check Groq AI
	aiStatus := "healthy"
	if err := h.aiService.HealthCheck(); err != nil {
		aiStatus = "unhealthy: " + err.Error()
	}

	// Overall Status
	overallStatus := "healthy"
	statusCode := http.StatusOK
	if dbStatus != "healthy" || redisStatus != "healthy" {
		overallStatus = "degraded"
		// If DB is down, consider service unavailable. If Redis/AI down, it's just degraded.
		if dbStatus != "healthy" {
			statusCode = http.StatusServiceUnavailable
		}
	}

	c.JSON(statusCode, gin.H{
		"service": "grawizah-api",
		"version": "1.0.0",
		"status":  overallStatus,
		"uptime":  time.Since(startTime).String(),
		"checks": gin.H{
			"database": dbStatus,
			"redis":    redisStatus,
			"groq_ai":  aiStatus,
		},
	})
}
