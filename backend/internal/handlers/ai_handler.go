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
		"success":    true,
		"data":       result,
		"confidence": result["confidence"],
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

	result, err := h.aiService.TranslateText(c.Request.Context(), input.Text, input.TargetLang)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return shape matching frontend TranslatorService expectations
	c.JSON(http.StatusOK, gin.H{
		"translatedText": result["translated_text"],
		"sourceLang":     result["source_language"],
		"targetLang":     result["target_language"],
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

	result, err := h.aiService.DetectLanguage(c.Request.Context(), input.Text)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Return shape matching frontend TranslatorService expectations
	c.JSON(http.StatusOK, gin.H{
		"language": result["language"],
	})
}
// ChatWithAI handles POST /api/ai/chat
func (h *AIHandler) ChatWithAI(c *gin.Context) {
	var input struct {
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	response, err := h.aiService.Chat(c.Request.Context(), input.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"response": response,
	})
}
