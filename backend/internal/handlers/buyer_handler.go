package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type BuyerHandler struct {
	buyerService *services.BuyerService
}

func NewBuyerHandler(buyerService *services.BuyerService) *BuyerHandler {
	return &BuyerHandler{
		buyerService: buyerService,
	}
}

// GetBuyerRadar handles GET /api/buyers/radar
func (h *BuyerHandler) GetBuyerRadar(c *gin.Context) {
	// TODO: Call service with filters (country, min_score, category)
	c.JSON(http.StatusOK, []interface{}{})
}

// GetBuyerByID handles GET /api/buyers/:id
func (h *BuyerHandler) GetBuyerByID(c *gin.Context) {
	id := c.Param("id")

	// TODO: Call service
	c.JSON(http.StatusOK, gin.H{
		"id":           id,
		"company_name": "Sample Buyer Inc",
		"country":      "USA",
		"buy_score":    85,
	})
}

// SearchBuyers handles POST /api/buyers/search
func (h *BuyerHandler) SearchBuyers(c *gin.Context) {
	var input struct {
		Query string `json:"query" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service
	c.JSON(http.StatusOK, []interface{}{})
}

// GetLeadScore handles POST /api/buyers/:id/lead-score
func (h *BuyerHandler) GetLeadScore(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		ProductCategory string `json:"product_category" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call AI service for lead scoring
	c.JSON(http.StatusOK, gin.H{
		"buyer_id":               id,
		"conversion_probability": 0.82,
		"buy_score":              82,
		"factors": gin.H{
			"import_frequency": 0.85,
			"volume_trend":     0.78,
			"category_match":   0.90,
			"country_affinity": 0.75,
		},
	})
}
