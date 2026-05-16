package handlers

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
	"github.com/grawizah/backend/internal/repository"
	"github.com/twilio/twilio-go"
	"github.com/twilio/twilio-go/client"
	api "github.com/twilio/twilio-go/rest/api/v2010"
)

// ChatHandler handles chat and WhatsApp bridge operations
type ChatHandler struct {
	chatRepo *repository.ChatRepository
}

// NewChatHandler creates a new chat handler
func NewChatHandler(chatRepo *repository.ChatRepository) *ChatHandler {
	return &ChatHandler{chatRepo: chatRepo}
}

// SendMessage handles sending a chat message
func (h *ChatHandler) SendMessage(c *gin.Context) {
	var req struct {
		SupplierID string `json:"supplierId" binding:"required"`
		BuyerID    string `json:"buyerId" binding:"required"`
		ProductID  string `json:"productId"`
		Message    string `json:"message" binding:"required"`
		Channel    string `json:"channel" binding:"required"` // chat, whatsapp
		SenderID   string `json:"senderId" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	msg := &models.ChatMessage{
		SupplierID: req.SupplierID,
		BuyerID:    req.BuyerID,
		Message:    req.Message,
		Channel:    req.Channel,
		SenderID:   req.SenderID,
	}

	if req.ProductID != "" {
		msg.ProductID = &req.ProductID
	}

	if err := h.chatRepo.SaveMessage(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Message sent and saved",
		"data":    msg,
	})
}

// GetChatHistory retrieves chat history
func (h *ChatHandler) GetChatHistory(c *gin.Context) {
	supplierID := c.Param("supplier_id")
	buyerID := c.Query("buyer_id")

	if buyerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "buyer_id is required"})
		return
	}

	messages, err := h.chatRepo.GetHistory(supplierID, buyerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch history: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"messages":   messages,
		"supplierId": supplierID,
		"buyerId":    buyerID,
	})
}

// SendWhatsAppMessage sends a message via WhatsApp Business API
func (h *ChatHandler) SendWhatsAppMessage(c *gin.Context) {
	var req struct {
		To      string `json:"to" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Integrate with Twilio WhatsApp Business API
	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	whatsappFrom := os.Getenv("TWILIO_WHATSAPP_FROM")

	if accountSid == "" || authToken == "" {
		// Mock behavior if Twilio is not configured
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "WhatsApp message simulated (Twilio credentials not found)",
			"to":      req.To,
		})
		return
	}

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	params := &api.CreateMessageParams{}
	params.SetFrom("whatsapp:" + whatsappFrom)
	params.SetTo("whatsapp:" + req.To)
	params.SetBody(req.Message)

	_, err := client.Api.CreateMessage(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send WhatsApp message: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "WhatsApp message sent via Twilio",
		"to":      req.To,
	})
}

// ReceiveWhatsAppWebhook handles incoming WhatsApp messages
func (h *ChatHandler) ReceiveWhatsAppWebhook(c *gin.Context) {
	// Parse incoming message from Twilio (application/x-www-form-urlencoded)
	from := c.PostForm("From")
	to := c.PostForm("To")
	body := c.PostForm("Body")

	if from == "" || body == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing From or Body fields"})
		return
	}

	// Clean up WhatsApp prefixes
	if len(from) > 9 && from[:9] == "whatsapp:" {
		from = from[9:]
	}
	if len(to) > 9 && to[:9] == "whatsapp:" {
		to = to[9:]
	}

	// Verify Twilio signature
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")
	if authToken != "" {
		signature := c.Request.Header.Get("X-Twilio-Signature")
		if signature == "" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Missing Twilio signature"})
			return
		}

		// Build the full URL
		protocol := "http"
		if c.Request.TLS != nil || c.Request.Header.Get("X-Forwarded-Proto") == "https" {
			protocol = "https"
		}
		url := protocol + "://" + c.Request.Host + c.Request.URL.Path

		// Parse form for validation
		c.Request.ParseForm()
		params := make(map[string]string)
		for key, values := range c.Request.PostForm {
			if len(values) > 0 {
				params[key] = values[0]
			}
		}

		validator := client.NewRequestValidator(authToken)
		if !validator.Validate(url, params, signature) {
			c.JSON(http.StatusForbidden, gin.H{"error": "Invalid Twilio signature"})
			return
		}
	}

	msg := &models.ChatMessage{
		SupplierID: to,   // The recipient of the WhatsApp message (Twilio number / Supplier)
		BuyerID:    from, // The sender of the WhatsApp message (Buyer)
		SenderID:   from, // The sender ID is the one who sent the message
		Message:    body,
		Channel:    "whatsapp",
	}

	// Save to database
	// Sending real-time notification to frontend is handled automatically
	// by Supabase Realtime listening to 'chat_messages' INSERT events
	if err := h.chatRepo.SaveMessage(msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save message: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Webhook processed successfully",
	})
}
