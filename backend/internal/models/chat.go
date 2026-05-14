package models

import "time"

type ChatMessage struct {
	ID         string    `json:"id"`
	SupplierID string    `json:"supplierId"`
	BuyerID    string    `json:"buyerId"`
	ProductID  *string   `json:"productId,omitempty"`
	SenderID   string    `json:"senderId"`
	Message    string    `json:"message"`
	Channel    string    `json:"channel"` // chat, whatsapp
	IsRead     bool      `json:"isRead"`
	CreatedAt  time.Time `json:"createdAt"`
}
