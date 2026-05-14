package repository

import (
	"database/sql"
	"github.com/grawizah/backend/internal/models"
	"github.com/google/uuid"
	"time"
)

type ChatRepository struct {
	db *sql.DB
}

func NewChatRepository(db *sql.DB) *ChatRepository {
	return &ChatRepository{db: db}
}

func (r *ChatRepository) SaveMessage(msg *models.ChatMessage) error {
	query := `
		INSERT INTO chat_messages (
			id, supplier_id, buyer_id, product_id, sender_id, message, channel, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	
	if msg.ID == "" {
		msg.ID = uuid.New().String()
	}
	if msg.CreatedAt.IsZero() {
		msg.CreatedAt = time.Now()
	}

	_, err := r.db.Exec(query,
		msg.ID, msg.SupplierID, msg.BuyerID, msg.ProductID,
		msg.SenderID, msg.Message, msg.Channel, msg.CreatedAt,
	)
	
	return err
}

func (r *ChatRepository) GetHistory(supplierID, buyerID string) ([]models.ChatMessage, error) {
	query := `
		SELECT id, supplier_id, buyer_id, product_id, sender_id, message, channel, is_read, created_at
		FROM chat_messages
		WHERE supplier_id = $1 AND buyer_id = $2
		ORDER BY created_at ASC
	`
	
	rows, err := r.db.Query(query, supplierID, buyerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var messages []models.ChatMessage
	for rows.Next() {
		var m models.ChatMessage
		err := rows.Scan(
			&m.ID, &m.SupplierID, &m.BuyerID, &m.ProductID,
			&m.SenderID, &m.Message, &m.Channel, &m.IsRead, &m.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		messages = append(messages, m)
	}
	
	return messages, nil
}
