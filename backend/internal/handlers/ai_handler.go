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

	// TODO: Call AI service
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"hs_code":          "151311",
			"confidence":       0.95,
			"description":      "Coconut oil, virgin",
			"regulation_notes": "May require phytosanitary certificate",
		},
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

	// TODO: Call AI service
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"suggested_response": "Thank you for your interest in our products...",
			"language":           input.BuyerLanguage,
			"tone":               "professional",
		},
	})
}

// OptimizeListing handles POST /api/ai/optimize-listing
func (h *AIHandler) OptimizeListing(c *gin.Context) {
	var input struct {
		ProductID string `json:"product_id" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call AI service
	c.JSON(http.StatusOK, gin.H{
		"score": 75,
		"suggestions": gin.H{
			"title":       "Add more descriptive keywords",
			"description": "Include technical specifications",
			"hs_code":     "Verify HS code accuracy",
			"keywords":    []string{"organic", "premium", "export-grade"},
		},
	})
}

// TranslateText handles POST /api/ai/translate
func (h *AIHandler) TranslateText(c *gin.Context) {
	var input struct {
		Text       string `json:"text" binding:"required"`
		SourceLang string `json:"sourceLang"`
		TargetLang string `json:"targetLang" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call AI translation service (Groq/Llama 3)
	// For now, return mock response
	c.JSON(http.StatusOK, gin.H{
		"translatedText": input.Text, // In production, this would be translated
		"sourceLang":     input.SourceLang,
		"targetLang":     input.TargetLang,
		"confidence":     0.95,
	})
}

// DetectLanguage handles POST /api/ai/detect-language
func (h *AIHandler) DetectLanguage(c *gin.Context) {
	var input struct {
		Text string `json:"text" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call AI language detection service
	// For now, return mock response
	c.JSON(http.StatusOK, gin.H{
		"language":   "en",
		"confidence": 0.98,
	})
}
