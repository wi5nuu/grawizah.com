package handlers

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type CompanyHandler struct {
	service *services.CompanyService
}

func NewCompanyHandler(service *services.CompanyService) *CompanyHandler {
	return &CompanyHandler{service: service}
}

// GetCompanyByID handles GET /api/companies/:id
func (h *CompanyHandler) GetCompanyByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Company ID is required"})
		return
	}

	company, err := h.service.GetCompanyByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch company details"})
		return
	}
	c.JSON(http.StatusOK, company)
}

// GetMyCompany handles GET /api/companies/me
func (h *CompanyHandler) GetMyCompany(c *gin.Context) {
	// In a real app, you would get the UserID from the JWT context
	// userID := c.GetString("user_id")
	userID := "mock_user_123"

	company, err := h.service.GetMyCompany(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch your company details"})
		return
	}
	c.JSON(http.StatusOK, company)
}
