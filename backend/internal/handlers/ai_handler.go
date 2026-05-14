package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type AIHandler struct {
	aiService *services.AIService
}

func NewAIHandler(aiService *services.AIService) *AIHandler {
	return &AIHandler{
		aiService: aiService,
	}
}

// ClassifyHSCode handles POST /api/ai/hs-code
func (h *AIHandler) ClassifyHSCode(c *gin.Context) {
	var input struct {
		Description string `json:"description" binding:"required"`
		Category    string `json:"category"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.aiService.ClassifyHSCode(c.Request.Context(), input.Description, input.Category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

// GetResponseSuggestion handles POST /api/ai/response-suggestion
func (h *AIHandler) GetResponseSuggestion(c *gin.Context) {
	var input struct {
		InquiryMessage string `json:"inquiry_message" binding:"required"`
		ProductName    string `json:"product_name" binding:"required"`
		BuyerCountry   string `json:"buyer_country" binding:"required"`
		BuyerLanguage  string `json:"buyer_language"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.aiService.GenerateResponseSuggestion(c.Request.Context(), input.InquiryMessage, input.ProductName, input.BuyerCountry, input.BuyerLanguage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    result,
	})
}

// OptimizeListing handles POST /api/ai/optimize-listing
func (h *AIHandler) OptimizeListing(c *gin.Context) {
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.aiService.OptimizeListing(c.Request.Context(), input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// TranslateText handles POST /api/ai/translate
func (h *AIHandler) TranslateText(c *gin.Context) {
	var input struct {
		Text       string `json:"text" binding:"required"`
		TargetLang string `json:"targetLang" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Reusing response suggestion logic for simple translation prompt
	result, err := h.aiService.GenerateResponseSuggestion(c.Request.Context(), input.Text, "N/A", "N/A", input.TargetLang)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"translatedText": result["suggested_response"],
		"targetLang":     input.TargetLang,
	})
}

// DetectLanguage handles POST /api/ai/detect-language
func (h *AIHandler) DetectLanguage(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"language":   "auto",
		"confidence": 1.0,
	})
}
