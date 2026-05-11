package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type CompetitorHandler struct {
	service *services.CompetitorService
}

func NewCompetitorHandler(service *services.CompetitorService) *CompetitorHandler {
	return &CompetitorHandler{service: service}
}

// GetBenchmark handles GET /api/competitor/benchmark
func (h *CompetitorHandler) GetBenchmark(c *gin.Context) {
	productName := c.Query("product")
	if productName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product name is required"})
		return
	}

	result, err := h.service.GetBenchmarkData(productName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch benchmark data"})
		return
	}

	c.JSON(http.StatusOK, result)
}
