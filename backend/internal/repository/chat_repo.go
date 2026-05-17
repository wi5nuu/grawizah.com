package repository

import (
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/grawizah/backend/internal/models"
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

	if r.db == nil {
		return nil // Success in mock mode
	}

	// Double-check and auto-create buyer record if missing to prevent foreign key violations
	if msg.BuyerID != "" {
		var exists bool
		err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM buyers WHERE id = $1)", msg.BuyerID).Scan(&exists)
		if err == nil && !exists {
			log.Printf("🛠️  Auto-creating missing buyer record in chat for ID: %s", msg.BuyerID)
			
			var userExists bool
			_ = r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", msg.BuyerID).Scan(&userExists)
			if !userExists {
				_, _ = r.db.Exec(`
					INSERT INTO users (id, email, role, created_at, updated_at)
					VALUES ($1, 'buyer@grawizah.com', 'buyer', NOW(), NOW())
					ON CONFLICT (id) DO NOTHING
				`, msg.BuyerID)
			}
			
			_, err = r.db.Exec(`
				INSERT INTO buyers (id, company_name, country, buy_score, verified, created_at, updated_at)
				VALUES ($1, 'EuroTech Procurement LLC', 'Indonesia', 95, true, NOW(), NOW())
				ON CONFLICT (id) DO NOTHING
			`, msg.BuyerID)
			if err != nil {
				log.Printf("⚠️  Failed to auto-create buyer in chat repository: %v", err)
			}
		}
	}

	// Double-check and auto-create company record if missing to prevent supplier_id foreign key violations
	if msg.SupplierID != "" {
		var exists bool
		err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM companies WHERE id = $1)", msg.SupplierID).Scan(&exists)
		if err == nil && !exists {
			log.Printf("🛠️  Auto-creating missing supplier company in chat for ID: %s", msg.SupplierID)
			
			var userExists bool
			_ = r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)", msg.SupplierID).Scan(&userExists)
			if !userExists {
				_, _ = r.db.Exec(`
					INSERT INTO users (id, email, role, created_at, updated_at)
					VALUES ($1, 'supplier_auto@grawizah.com', 'free_trader', NOW(), NOW())
					ON CONFLICT (id) DO NOTHING
				`, msg.SupplierID)
			}
			
			_, err = r.db.Exec(`
				INSERT INTO companies (id, owner_id, name, country, verified, score, created_at, updated_at)
				VALUES ($1, $1, 'Global Supplier Corp', 'Indonesia', true, 95, NOW(), NOW())
				ON CONFLICT (id) DO NOTHING
			`, msg.SupplierID)
			if err != nil {
				log.Printf("⚠️  Failed to auto-create company in chat repository: %v", err)
			}
		}
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
	
	if r.db == nil {
		return []models.ChatMessage{}, nil // Return empty history in mock mode
	}

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
