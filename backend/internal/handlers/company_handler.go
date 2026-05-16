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

// UpdateCompany handles PUT /api/companies/:id
func (h *CompanyHandler) UpdateCompany(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Name     string `json:"name"`
		Industry string `json:"industry"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "Company updated successfully",
		"id":      id,
	})
}

// GetCompanyProducts handles GET /api/companies/:id/products
func (h *CompanyHandler) GetCompanyProducts(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"data": []interface{}{}, "company_id": id})
}

// GetCompanyStats handles GET /api/companies/:id/stats
func (h *CompanyHandler) GetCompanyStats(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"company_id":      id,
		"total_products":  0,
		"total_inquiries": 0,
		"conversion_rate": 0,
	})
}

// AddCertification handles POST /api/companies/:id/certifications
func (h *CompanyHandler) AddCertification(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusCreated, gin.H{"message": "Certification added", "company_id": id})
}

// RemoveCertification handles DELETE /api/companies/:id/certifications/:cert_id
func (h *CompanyHandler) RemoveCertification(c *gin.Context) {
	id := c.Param("id")
	certID := c.Param("cert_id")
	c.JSON(http.StatusOK, gin.H{"message": "Certification removed", "company_id": id, "cert_id": certID})
}

// VerifyCompany handles PUT /api/companies/:id/verify
func (h *CompanyHandler) VerifyCompany(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Company verified", "id": id})
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

// GetAllCompanies handles GET /api/companies
func (h *CompanyHandler) GetAllCompanies(c *gin.Context) {
	companies, err := h.service.GetAllCompanies()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch companies"})
		return
	}
	c.JSON(http.StatusOK, companies)
}
