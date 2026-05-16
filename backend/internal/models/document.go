package models

import (
	"time"

	"github.com/google/uuid"
)

// Document represents an encrypted document in the vault
type Document struct {
	ID        string     `json:"id" db:"id"`
	BuyerID   string     `json:"buyer_id" db:"buyer_id"`
	Filename  string     `json:"filename" db:"filename"`
	FileURL   string     `json:"file_url" db:"file_url"`
	Encrypted bool       `json:"encrypted" db:"encrypted"`
	FileSize  int64      `json:"file_size" db:"file_size"`
	MimeType  string     `json:"mime_type" db:"mime_type"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}

// NewDocument creates a new document instance
func NewDocument(buyerID, filename, fileURL string, fileSize int64, mimeType string) *Document {
	now := time.Now()
	return &Document{
		ID:        uuid.New().String(),
		BuyerID:   buyerID,
		Filename:  filename,
		FileURL:   fileURL,
		Encrypted: true,
		FileSize:  fileSize,
		MimeType:  mimeType,
		CreatedAt: &now,
		UpdatedAt: &now,
	}
}
