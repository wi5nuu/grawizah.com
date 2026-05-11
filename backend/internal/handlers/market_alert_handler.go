package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type MarketAlertHandler struct {
	service *services.MarketAlertService
}

func NewMarketAlertHandler(service *services.MarketAlertService) *MarketAlertHandler {
	return &MarketAlertHandler{service: service}
}

// GetAlerts handles GET /api/alerts/market
func (h *MarketAlertHandler) GetAlerts(c *gin.Context) {
	category := c.Query("category")
	
	alerts, err := h.service.GetMarketAlerts(category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch market alerts"})
		return
	}

	c.JSON(http.StatusOK, alerts)
}
