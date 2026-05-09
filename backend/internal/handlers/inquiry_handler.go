package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type InquiryHandler struct {
	inquiryService *services.InquiryService
}

func NewInquiryHandler(inquiryService *services.InquiryService) *InquiryHandler {
	return &InquiryHandler{
		inquiryService: inquiryService,
	}
}

// GetInquiriesBySupplier handles GET /api/inquiries/supplier/:id
func (h *InquiryHandler) GetInquiriesBySupplier(c *gin.Context) {
	// TODO: Call service with c.Param("id")
	c.JSON(http.StatusOK, []interface{}{})
}

// GetInquiriesByBuyer handles GET /api/inquiries/buyer/:id
func (h *InquiryHandler) GetInquiriesByBuyer(c *gin.Context) {
	// TODO: Call service with c.Param("id")
	c.JSON(http.StatusOK, []interface{}{})
}

// CreateInquiry handles POST /api/inquiries
func (h *InquiryHandler) CreateInquiry(c *gin.Context) {
	var input map[string]interface{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service
	c.JSON(http.StatusCreated, gin.H{
		"message": "Inquiry created successfully",
		"data":    input,
	})
}

// RespondToInquiry handles PUT /api/inquiries/:id/respond
func (h *InquiryHandler) RespondToInquiry(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service
	c.JSON(http.StatusOK, gin.H{
		"message": "Response sent successfully",
		"id":      id,
	})
}

// GetAnalytics handles GET /api/inquiries/analytics/:supplier_id
func (h *InquiryHandler) GetAnalytics(c *gin.Context) {
	// TODO: Call service with c.Param("supplier_id")
	c.JSON(http.StatusOK, gin.H{
		"total_inquiries":         0,
		"response_rate":           0.0,
		"conversion_rate":         0.0,
		"repeat_buyer_rate":       0.0,
		"avg_response_time_hours": 0.0,
	})
}

// MarkAsConverted handles PUT /api/inquiries/:id/convert
func (h *InquiryHandler) MarkAsConverted(c *gin.Context) {
	id := c.Param("id")

	// TODO: Call service
	c.JSON(http.StatusOK, gin.H{
		"message": "Inquiry marked as converted",
		"id":      id,
	})
}
