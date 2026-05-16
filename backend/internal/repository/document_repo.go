package repository

import (
	"database/sql"

	"github.com/grawizah/backend/internal/models"
)

// DocumentRepository implements data access for Document
type DocumentRepository struct {
	db *sql.DB
}

// NewDocumentRepository creates a new document repository
func NewDocumentRepository(db *sql.DB) *DocumentRepository {
	return &DocumentRepository{db: db}
}

// Create inserts a new document record
func (r *DocumentRepository) Create(doc *models.Document) error {
	query := `
		INSERT INTO documents (id, buyer_id, filename, file_url, encrypted, file_size, mime_type, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`

	_, err := r.db.Exec(query,
		doc.ID, doc.BuyerID, doc.Filename, doc.FileURL,
		doc.Encrypted, doc.FileSize, doc.MimeType,
		doc.CreatedAt, doc.UpdatedAt,
	)

	return err
}

// GetByID retrieves a document by ID (only if not soft-deleted)
func (r *DocumentRepository) GetByID(id string) (*models.Document, error) {
	query := `
		SELECT id, buyer_id, filename, file_url, encrypted, file_size, mime_type, created_at, updated_at
		FROM documents
		WHERE id = $1 AND deleted_at IS NULL
	`

	doc := &models.Document{}
	err := r.db.QueryRow(query, id).Scan(
		&doc.ID, &doc.BuyerID, &doc.Filename, &doc.FileURL,
		&doc.Encrypted, &doc.FileSize, &doc.MimeType,
		&doc.CreatedAt, &doc.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}

	return doc, err
}

// GetByBuyerID retrieves all documents belonging to a buyer
func (r *DocumentRepository) GetByBuyerID(buyerID string) ([]models.Document, error) {
	query := `
		SELECT id, buyer_id, filename, file_url, encrypted, file_size, mime_type, created_at, updated_at
		FROM documents
		WHERE buyer_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`

	rows, err := r.db.Query(query, buyerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var docs []models.Document
	for rows.Next() {
		var d models.Document
		err := rows.Scan(
			&d.ID, &d.BuyerID, &d.Filename, &d.FileURL,
			&d.Encrypted, &d.FileSize, &d.MimeType,
			&d.CreatedAt, &d.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		docs = append(docs, d)
	}

	return docs, nil
}

// Delete soft deletes a document
func (r *DocumentRepository) Delete(id string) error {
	query := `UPDATE documents SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return models.ErrNotFound
	}

	return nil
}
