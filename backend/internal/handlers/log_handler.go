package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type LogHandler struct{}

func NewLogHandler() *LogHandler {
	return &LogHandler{}
}

// LogError handles POST /api/logs/error
func (h *LogHandler) LogError(c *gin.Context) {
	var input struct {
		Error   string `json:"error"`
		Context string `json:"context"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// In production, this would write to a logging service
	c.JSON(http.StatusOK, gin.H{"message": "Error logged"})
}
