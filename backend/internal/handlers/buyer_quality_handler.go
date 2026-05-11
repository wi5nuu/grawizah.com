package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type BuyerQualityHandler struct {
	service *services.BuyerQualityService
}

func NewBuyerQualityHandler(service *services.BuyerQualityService) *BuyerQualityHandler {
	return &BuyerQualityHandler{service: service}
}

// GetQualityScore handles GET /api/buyers/:id/quality-score
func (h *BuyerQualityHandler) GetQualityScore(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Buyer ID is required"})
		return
	}

	score, err := h.service.GetQualityScore(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch quality score"})
		return
	}

	c.JSON(http.StatusOK, score)
}
