package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
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
	id := c.Param("id")
	inquiries, err := h.inquiryService.GetInquiriesBySupplier(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, inquiries)
}

// GetInquiriesByBuyer handles GET /api/inquiries/buyer/:id
func (h *InquiryHandler) GetInquiriesByBuyer(c *gin.Context) {
	id := c.Param("id")
	inquiries, err := h.inquiryService.GetInquiriesByBuyer(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, inquiries)
}

// CreateInquiry handles POST /api/inquiries
func (h *InquiryHandler) CreateInquiry(c *gin.Context) {
	var inquiry models.Inquiry
	if err := c.ShouldBindJSON(&inquiry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.inquiryService.CreateInquiry(c.Request.Context(), &inquiry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Inquiry created successfully",
		"data":    inquiry,
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

	if err := h.inquiryService.RespondToInquiry(c.Request.Context(), id, input.Message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Response sent successfully",
		"id":      id,
	})
}

// GetAnalytics handles GET /api/inquiries/analytics/:supplier_id
func (h *InquiryHandler) GetAnalytics(c *gin.Context) {
	id := c.Param("supplier_id")
	analytics, err := h.inquiryService.GetAnalytics(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, analytics)
}

// MarkAsConverted handles PUT /api/inquiries/:id/convert
func (h *InquiryHandler) MarkAsConverted(c *gin.Context) {
	id := c.Param("id")

	if err := h.inquiryService.MarkAsConverted(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Inquiry marked as converted",
		"id":      id,
	})
}
