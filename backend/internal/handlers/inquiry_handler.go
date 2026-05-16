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

	c.JSON(http.StatusCreated, inquiry)
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

	// Return the updated inquiry
	inquiry, err := h.inquiryService.GetInquiryByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Response sent successfully",
			"id":      id,
		})
		return
	}
	c.JSON(http.StatusOK, inquiry)
}

// GetInquiryByID handles GET /api/inquiries/:id
func (h *InquiryHandler) GetInquiryByID(c *gin.Context) {
	id := c.Param("id")
	inquiry, err := h.inquiryService.GetInquiryByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inquiry not found"})
		return
	}
	c.JSON(http.StatusOK, inquiry)
}

// AISuggestResponse handles POST /api/inquiries/:id/ai-suggest
func (h *InquiryHandler) AISuggestResponse(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"inquiry_id":         id,
		"suggested_response": "Thank you for your inquiry. We would be happy to provide more information about our product specifications and pricing.",
	})
}

// RateInquiry handles PUT /api/inquiries/:id/rate
func (h *InquiryHandler) RateInquiry(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Rating int `json:"rating" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Inquiry rated", "id": id, "rating": input.Rating})
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
