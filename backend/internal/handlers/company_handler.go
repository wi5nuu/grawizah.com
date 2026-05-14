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
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	company, err := h.service.GetMyCompany(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Company not found for this user"})
		return
	}
	c.JSON(http.StatusOK, company)
}
