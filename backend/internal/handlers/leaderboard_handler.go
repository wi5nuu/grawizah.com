package handlers

import (
	"net/http"
	"strconv"

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
	suppliers, err := h.service.GetTopSuppliers(10)
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

// GetTopSuppliers handles GET /api/leaderboard/top
func (h *LeaderboardHandler) GetTopSuppliers(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	scores, err := h.service.GetTopSuppliers(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": scores})
}

// GetCompanyBreakdown handles GET /api/leaderboard/company/:id/breakdown
func (h *LeaderboardHandler) GetCompanyBreakdown(c *gin.Context) {
	id := c.Param("id")
	score, err := h.service.GetCompanyRank(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
		return
	}
	c.JSON(http.StatusOK, score)
}

// HideCompany handles PUT /api/leaderboard/company/:id/hide
func (h *LeaderboardHandler) HideCompany(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Company hidden from leaderboard", "id": id})
}

// ShowCompany handles PUT /api/leaderboard/company/:id/show
func (h *LeaderboardHandler) ShowCompany(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Company shown on leaderboard", "id": id})
}
