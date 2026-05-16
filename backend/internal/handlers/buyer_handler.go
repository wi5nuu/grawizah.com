package handlers

import (
	"net/http"
	"strconv"

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
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	buyers, err := h.buyerService.GetBuyerRadar(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, buyers)
}

// GetBuyerByID handles GET /api/buyers/:id
func (h *BuyerHandler) GetBuyerByID(c *gin.Context) {
	id := c.Param("id")

	buyer, err := h.buyerService.GetBuyerByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, buyer)
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

	buyers, err := h.buyerService.SearchBuyers(c.Request.Context(), input.Query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, buyers)
}

// GetBuyersByCountry handles GET /api/buyers/country/:country
func (h *BuyerHandler) GetBuyersByCountry(c *gin.Context) {
	country := c.Param("country")
	buyers, err := h.buyerService.GetBuyersByCountry(c.Request.Context(), country)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": buyers})
}

// GetTopBuyers handles GET /api/buyers/top
func (h *BuyerHandler) GetTopBuyers(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	buyers, err := h.buyerService.GetHighQualityBuyers(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": buyers})
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

	score, err := h.buyerService.CalculateLeadScore(c.Request.Context(), id, input.ProductCategory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, score)
}
