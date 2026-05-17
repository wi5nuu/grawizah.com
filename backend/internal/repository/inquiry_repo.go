package repository

import (
	"database/sql"
	"fmt"
	"log"
	"time"

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

func uuidOrNil(s string) interface{} {
	if s == "" || s == "p_default" || s == "00000000-0000-0000-0000-000000000000" {
		return nil
	}
	return s
}

// Create inserts a new inquiry
func (r *InquiryRepository) Create(inquiry *models.Inquiry) error {
	// Initialize ID and timestamps if blank
	if inquiry.ID == "" {
		base := models.NewBaseEntity()
		inquiry.ID = base.ID
		inquiry.CreatedAt = base.CreatedAt
		inquiry.UpdatedAt = base.UpdatedAt
	} else {
		now := time.Now()
		if inquiry.CreatedAt == nil {
			inquiry.CreatedAt = &now
		}
		if inquiry.UpdatedAt == nil {
			inquiry.UpdatedAt = &now
		}
	}

	// Double-check and auto-create buyer record if missing to prevent foreign key fkey violations
	if inquiry.BuyerID != "" {
		var exists bool
		err := r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM buyers WHERE id = $1)", inquiry.BuyerID).Scan(&exists)
		if err == nil && !exists {
			log.Printf("🛠️  Auto-creating missing buyer record in database for ID: %s", inquiry.BuyerID)

			// 1. Resolve real email from users table (never hardcode)
			var userEmail string
			userErr := r.db.QueryRow("SELECT email FROM users WHERE id = $1", inquiry.BuyerID).Scan(&userEmail)
			if userErr != nil || userEmail == "" {
				userEmail = inquiry.BuyerID + "@buyer.grawizah.com" // safe unique fallback
			}

			// 2. Ensure user row exists with real email
			_, _ = r.db.Exec(`
				INSERT INTO users (id, email, role, created_at, updated_at)
				VALUES ($1, $2, 'buyer', NOW(), NOW())
				ON CONFLICT (id) DO NOTHING
			`, inquiry.BuyerID, userEmail)

			// 3. Insert into buyers table using real user data (no hardcoded company name)
			companyName := "Buyer " + inquiry.BuyerID[:8]
			_, err = r.db.Exec(`
				INSERT INTO buyers (id, company_name, country, buy_score, verified, created_at, updated_at)
				VALUES ($1, $2, 'Unknown', 50, false, NOW(), NOW())
				ON CONFLICT (id) DO NOTHING
			`, inquiry.BuyerID, companyName)
			if err != nil {
				log.Printf("⚠️  Failed to auto-create buyer in repository: %v", err)
			}
		}
	}

	// Auto-resolve SupplierID from ProductID if not provided
	if inquiry.SupplierID == "" && inquiry.ProductID != "" && inquiry.ProductID != "p_default" {
		var companyID string
		err := r.db.QueryRow("SELECT company_id FROM products WHERE id = $1 AND deleted_at IS NULL", inquiry.ProductID).Scan(&companyID)
		if err == nil && companyID != "" {
			inquiry.SupplierID = companyID
		}
	}

	query := `
		INSERT INTO inquiries (
			id, buyer_id, supplier_id, product_id, message, source_type,
			source_metadata, status, converted_to_deal, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
	`
	
	_, err := r.db.Exec(query,
		inquiry.ID, inquiry.BuyerID, uuidOrNil(inquiry.SupplierID), uuidOrNil(inquiry.ProductID),
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
	var supplierID, productID, responseMessage sql.NullString
	err := r.db.QueryRow(query, id).Scan(
		&inquiry.ID, &inquiry.BuyerID, &supplierID, &productID,
		&inquiry.Message, &inquiry.SourceType, &inquiry.SourceMetadata,
		&inquiry.Status, &inquiry.ResponseTimeHours, &inquiry.ConvertedToDeal,
		&inquiry.BuyerRating, &responseMessage, &inquiry.RespondedAt,
		&inquiry.CreatedAt, &inquiry.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	if err == nil {
		inquiry.SupplierID = supplierID.String
		inquiry.ProductID = productID.String
		inquiry.ResponseMessage = responseMessage.String
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
		var supplierID, productID sql.NullString
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &supplierID, &productID,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		inq.SupplierID = supplierID.String
		inq.ProductID = productID.String
		inquiries = append(inquiries, inq)
	}
	// [L-03] catch mid-iteration errors
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return inquiries, nil
}

func (r *InquiryRepository) Update(inquiry *models.Inquiry) error {
	query := `
		UPDATE inquiries SET
			message = $2, status = $3::inquiry_status, response_time_hours = $4,
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

// GetBySupplierID retrieves all inquiries for a supplier with buyer and product details
func (r *InquiryRepository) GetBySupplierID(supplierID string) ([]models.InquiryDetail, error) {
	// Auto-resolve User ID to Company ID if the ID refers to a user/owner
	var resolvedCompanyID string
	err := r.db.QueryRow("SELECT id FROM companies WHERE owner_id = $1 AND deleted_at IS NULL", supplierID).Scan(&resolvedCompanyID)
	if err == nil && resolvedCompanyID != "" {
		log.Printf("🔄 Resolved supplier User ID %s to Company ID %s for inquiries retrieval", supplierID, resolvedCompanyID)
		supplierID = resolvedCompanyID
	}

	query := `
		SELECT i.id, i.buyer_id, i.supplier_id, i.product_id, i.message, i.source_type,
			i.source_metadata, i.status, i.response_time_hours, i.converted_to_deal,
			i.buyer_rating, i.created_at, i.updated_at,
			b.company_name as buyer_name, b.company_name as buyer_company, b.country as buyer_country,
			p.name as product_name
		FROM inquiries i
		LEFT JOIN buyers b ON i.buyer_id = b.id
		LEFT JOIN products p ON i.product_id = p.id
		WHERE i.supplier_id = $1 AND i.deleted_at IS NULL
		ORDER BY i.created_at DESC
	`
	
	rows, err := r.db.Query(query, supplierID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var inquiries []models.InquiryDetail
	for rows.Next() {
		var inq models.InquiryDetail
		var supplierIDVal, productIDVal, buyerName, buyerCompany, buyerCountry, productName sql.NullString
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &supplierIDVal, &productIDVal,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
			&buyerName, &buyerCompany, &buyerCountry,
			&productName,
		)
		if err != nil {
			return nil, err
		}
		inq.SupplierID = supplierIDVal.String
		inq.ProductID = productIDVal.String
		inq.BuyerName = buyerName.String
		inq.BuyerCompany = buyerCompany.String
		inq.BuyerCountry = buyerCountry.String
		inq.ProductName = productName.String
		inquiries = append(inquiries, inq)
	}
	// [L-03] catch mid-iteration errors
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return inquiries, nil
}

// GetByBuyerID retrieves all inquiries for a buyer with product and supplier details.
// Uses LEFT JOIN on buyers so inquiries always appear even if buyer profile is incomplete.
func (r *InquiryRepository) GetByBuyerID(buyerID string) ([]models.InquiryDetail, error) {
	// [FIX] Auto-ensure buyer record exists before querying, so the LEFT JOIN always resolves
	// This prevents silent empty results when the authenticated user has no buyers row yet.
	var buyerExists bool
	_ = r.db.QueryRow("SELECT EXISTS(SELECT 1 FROM buyers WHERE id = $1)", buyerID).Scan(&buyerExists)
	if !buyerExists {
		log.Printf("⚠️  GetByBuyerID: buyer %s not in buyers table, auto-provisioning...", buyerID)
		var realEmail string
		_ = r.db.QueryRow("SELECT email FROM users WHERE id = $1", buyerID).Scan(&realEmail)
		if realEmail == "" {
			realEmail = buyerID + "@buyer.grawizah.com"
		}
		companyName := "Buyer " + buyerID[:8]
		_, _ = r.db.Exec(`
			INSERT INTO buyers (id, company_name, country, buy_score, verified, created_at, updated_at)
			VALUES ($1, $2, 'Unknown', 50, false, NOW(), NOW())
			ON CONFLICT (id) DO NOTHING
		`, buyerID, companyName)
	}

	query := `
		SELECT i.id, i.buyer_id, i.supplier_id, i.product_id, i.message, i.source_type,
			i.source_metadata, i.status, i.response_time_hours, i.converted_to_deal,
			i.buyer_rating, i.created_at, i.updated_at,
			COALESCE(b.company_name, u.email, i.buyer_id) as buyer_name,
			COALESCE(b.company_name, u.email, i.buyer_id) as buyer_company,
			COALESCE(b.country, 'Unknown') as buyer_country,
			p.name as product_name
		FROM inquiries i
		LEFT JOIN buyers b ON i.buyer_id = b.id
		LEFT JOIN users u ON i.buyer_id = u.id
		LEFT JOIN products p ON i.product_id = p.id
		WHERE i.buyer_id = $1 AND i.deleted_at IS NULL
		ORDER BY i.created_at DESC
	`

	rows, err := r.db.Query(query, buyerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var inquiries []models.InquiryDetail
	for rows.Next() {
		var inq models.InquiryDetail
		var supplierIDVal, productIDVal, buyerName, buyerCompany, buyerCountry, productName sql.NullString
		err := rows.Scan(
			&inq.ID, &inq.BuyerID, &supplierIDVal, &productIDVal,
			&inq.Message, &inq.SourceType, &inq.SourceMetadata,
			&inq.Status, &inq.ResponseTimeHours, &inq.ConvertedToDeal,
			&inq.BuyerRating, &inq.CreatedAt, &inq.UpdatedAt,
			&buyerName, &buyerCompany, &buyerCountry,
			&productName,
		)
		if err != nil {
			return nil, err
		}
		inq.SupplierID = supplierIDVal.String
		inq.ProductID = productIDVal.String
		inq.BuyerName = buyerName.String
		inq.BuyerCompany = buyerCompany.String
		inq.BuyerCountry = buyerCountry.String
		inq.ProductName = productName.String
		inquiries = append(inquiries, inq)
	}
	// [L-03] catch mid-iteration errors
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return inquiries, nil
}
// GetAnalytics calculates analytics for a supplier
func (r *InquiryRepository) GetAnalytics(supplierID string) (*models.InquiryAnalytics, error) {
	details, err := r.GetBySupplierID(supplierID)
	if err != nil {
		return nil, err
	}
	
	// Convert []models.InquiryDetail to []models.Inquiry for calculation
	inquiries := make([]models.Inquiry, len(details))
	for i, d := range details {
		inquiries[i] = d.Inquiry
	}
	
	analytics := models.CalculateAnalytics(inquiries)
	return &analytics, nil
}

// RateInquiry persists a buyer rating (1-5) to the database. [M-02]
// The rating column is validated at DB level: CHECK (rating >= 1 AND rating <= 5).
func (r *InquiryRepository) RateInquiry(id string, rating int) error {
	if rating < 1 || rating > 5 {
		return fmt.Errorf("rating must be between 1 and 5, got %d", rating)
	}

	query := `
		UPDATE inquiries
		SET buyer_rating = $2, updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL
	`

	result, err := r.db.Exec(query, id, rating)
	if err != nil {
		return fmt.Errorf("failed to save rating: %w", err)
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

