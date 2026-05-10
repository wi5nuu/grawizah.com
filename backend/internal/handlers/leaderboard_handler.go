package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type LeaderboardHandler struct {
	service *services.LeaderboardService
}

func NewLeaderboardHandler(service *services.LeaderboardService) *LeaderboardHandler {
	return &LeaderboardHandler{service: service}
}

// GetLeaderboard handles GET /api/leaderboard
func (h *LeaderboardHandler) GetLeaderboard(c *gin.Context) {
	suppliers, err := h.service.GetTopSuppliers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}
	c.JSON(http.StatusOK, suppliers)
}

// GetCompanyRank handles GET /api/leaderboard/company/:id
func (h *LeaderboardHandler) GetCompanyRank(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Company ID is required"})
		return
	}

	rankInfo, err := h.service.GetCompanyRank(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch company rank"})
		return
	}
	c.JSON(http.StatusOK, rankInfo)
}
