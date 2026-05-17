package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
	"github.com/grawizah/backend/internal/services"
)

type InquiryHandler struct {
	inquiryService *services.InquiryService
	aiService      *services.AIService
}

func NewInquiryHandler(inquiryService *services.InquiryService, aiService *services.AIService) *InquiryHandler {
	return &InquiryHandler{
		inquiryService: inquiryService,
		aiService:      aiService,
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
	log.Printf("🔍 GetInquiriesByBuyer called for buyer_id: %s", id)
	inquiries, err := h.inquiryService.GetInquiriesByBuyer(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	// Always return an array — never null — so frontend doesn't crash
	if inquiries == nil {
		inquiries = []models.InquiryDetail{}
	}
	log.Printf("✅ GetInquiriesByBuyer: found %d inquiries for buyer_id: %s", len(inquiries), id)
	c.JSON(http.StatusOK, inquiries)
}

// CreateInquiry handles POST /api/inquiries
func (h *InquiryHandler) CreateInquiry(c *gin.Context) {
	var inquiry models.Inquiry
	if err := c.ShouldBindJSON(&inquiry); err != nil {
		log.Printf("❌ CreateInquiry ShouldBindJSON error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("📥 CreateInquiry parsed payload: %+v", inquiry)

	// [M-03] Auto-inject authenticated buyer ID if blank in payload
	if inquiry.BuyerID == "" {
		inquiry.BuyerID = c.GetString("user_id")
		log.Printf("🔑 Auto-injected BuyerID: %s", inquiry.BuyerID)
	}

	if inquiry.Status == "" {
		inquiry.Status = models.StatusOpen
	}

	if err := h.inquiryService.CreateInquiry(c.Request.Context(), &inquiry); err != nil {
		log.Printf("❌ CreateInquiry error: %v", err)
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
		log.Printf("❌ RespondToInquiry error: %v", err)
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

// Deprecated_AISuggestResponse is a hardcoded stub kept for reference only.
// DO NOT register this in main.go — use GetAISuggestion instead.
// [H-06] This was incorrectly registered as the ai-suggest route handler.
func (h *InquiryHandler) Deprecated_AISuggestResponse(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{
		"inquiry_id":         id,
		"suggested_response": "Thank you for your inquiry. We would be happy to provide more information about our product specifications and pricing.",
	})
}

// RateInquiry handles PUT /api/inquiries/:id/rate
// [M-02] Now persists the rating to the database.
func (h *InquiryHandler) RateInquiry(c *gin.Context) {
	id := c.Param("id")
	var input struct {
		Rating int `json:"rating" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate range
	if input.Rating < 1 || input.Rating > 5 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "rating must be between 1 and 5"})
		return
	}

	if err := h.inquiryService.RateInquiry(c.Request.Context(), id, input.Rating); err != nil {
		if err.Error() == "not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Inquiry not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save rating"})
		return
	}

	// Return updated inquiry to confirm persistence
	inquiry, err := h.inquiryService.GetInquiryByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "Rating saved successfully",
			"id":      id,
			"rating":  input.Rating,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Rating saved successfully",
		"inquiry": inquiry,
	})
}

// GetInquiryRating handles GET /api/inquiries/:id/rating — verify rating was persisted. [M-02]
func (h *InquiryHandler) GetInquiryRating(c *gin.Context) {
	id := c.Param("id")
	inquiry, err := h.inquiryService.GetInquiryByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inquiry not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"inquiry_id":  id,
		"buyer_rating": inquiry.BuyerRating,
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

// GetAISuggestion handles POST /api/inquiries/:id/ai-suggest
func (h *InquiryHandler) GetAISuggestion(c *gin.Context) {
	id := c.Param("id")

	// Fetch the inquiry to get context
	inquiry, err := h.inquiryService.GetInquiryByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Inquiry not found"})
		return
	}

	result, err := h.aiService.GenerateResponseSuggestion(
		c.Request.Context(),
		inquiry.Message,
		inquiry.ProductID,
		"",   // buyer country - could be enriched from buyer profile
		"en", // default language
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "AI suggestion failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":            true,
		"inquiry_id":         id,
		"suggested_response": result["suggested_response"],
	})
}
