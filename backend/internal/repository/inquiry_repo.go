package repository

import (
	"database/sql"
	"github.com/grawizah/backend/internal/models"
)

// InquiryRepository implements the Repository interface for Inquiry
type InquiryRepository struct {
	db *sql.DB
}

// NewInquiryRepository creates a new inquiry repository
func NewInquiryRepository(db *sql.DB) *InquiryRepository {
	return &InquiryRepository{db: db}
}

// Create inserts a new inquiry
func (r *InquiryRepository) Create(inquiry *models.Inquiry) error {
	query := `
		INSERT INTO inquiries (
			id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, converted_to_deal, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`
	
	_, err := r.db.Exec(query,
		inquiry.ID, inquiry.BuyerID, inquiry.SupplierID, inquiry.ProductID,
		inquiry.Message, inquiry.SourceType, inquiry.SourceMetadata,
		inquiry.Status, inquiry.ConvertedToDeal, inquiry.CreatedAt, inquiry.UpdatedAt,
	)
	
	return err
}

// GetByID retrieves an inquiry by ID
func (r *InquiryRepository) GetByID(id string) (*models.Inquiry, error) {
	query := `
		SELECT id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, response_time_hours, converted_to_deal,
			buyer_rating, response_message, responded_at, created_at, updated_at
		FROM inquiries
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	inquiry := &models.Inquiry{}
	err := r.db.QueryRow(query, id).Scan(
		&inquiry.ID, &inquiry.BuyerID, &inquiry.SupplierID, &inquiry.ProductID,
		&inquiry.Message, &inquiry.SourceType, &inquiry.SourceMetadata,
		&inquiry.Status, &inquiry.ResponseTimeHours, &inquiry.ConvertedToDeal,
		&inquiry.BuyerRating, &inquiry.ResponseMessage, &inquiry.RespondedAt,
		&inquiry.CreatedAt, &inquiry.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	return inquiry, err
}

// GetAll retrieves all inquiries with pagination
func (r *InquiryRepository) GetAll(limit, offset int) ([]models.Inquiry, error) {
	query := `
		SELECT id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, response_time_hours, converted_to_deal,
			buyer_rating, created_at, updated_at
		FROM inquiries
		WHERE deleted_at IS NULL
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var inquiries []models.Inquiry
	for rows.Next() {
		var inq models.Inquiry
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &inq.SupplierID, &inq.ProductID,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		inquiries = append(inquiries, inq)
	}
	
	return inquiries, nil
}

// Update updates an existing inquiry
func (r *InquiryRepository) Update(inquiry *models.Inquiry) error {
	query := `
		UPDATE inquiries SET
			message = $2, status = $3, response_time_hours = $4,
			converted_to_deal = $5, buyer_rating = $6, response_message = $7,
			responded_at = $8, updated_at = $9
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	result, err := r.db.Exec(query,
		inquiry.ID, inquiry.Message, inquiry.Status, inquiry.ResponseTimeHours,
		inquiry.ConvertedToDeal, inquiry.BuyerRating, inquiry.ResponseMessage,
		inquiry.RespondedAt, inquiry.UpdatedAt,
	)
	
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

// Delete soft deletes an inquiry
func (r *InquiryRepository) Delete(id string) error {
	query := `UPDATE inquiries SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	
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

// GetBySupplierID retrieves all inquiries for a supplier
func (r *InquiryRepository) GetBySupplierID(supplierID string) ([]models.Inquiry, error) {
	query := `
		SELECT id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, response_time_hours, converted_to_deal,
			buyer_rating, created_at, updated_at
		FROM inquiries
		WHERE supplier_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := r.db.Query(query, supplierID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var inquiries []models.Inquiry
	for rows.Next() {
		var inq models.Inquiry
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &inq.SupplierID, &inq.ProductID,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		inquiries = append(inquiries, inq)
	}
	
	return inquiries, nil
}

// GetByBuyerID retrieves all inquiries for a buyer
func (r *InquiryRepository) GetByBuyerID(buyerID string) ([]models.Inquiry, error) {
	query := `
		SELECT id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, response_time_hours, converted_to_deal,
			buyer_rating, created_at, updated_at
		FROM inquiries
		WHERE buyer_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := r.db.Query(query, buyerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var inquiries []models.Inquiry
	for rows.Next() {
		var inq models.Inquiry
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &inq.SupplierID, &inq.ProductID,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		inquiries = append(inquiries, inq)
	}
	
	return inquiries, nil
}

// GetAnalytics calculates analytics for a supplier
func (r *InquiryRepository) GetAnalytics(supplierID string) (*models.InquiryAnalytics, error) {
	inquiries, err := r.GetBySupplierID(supplierID)
	if err != nil {
		return nil, err
	}
	
	analytics := models.CalculateAnalytics(inquiries)
	return &analytics, nil
}
