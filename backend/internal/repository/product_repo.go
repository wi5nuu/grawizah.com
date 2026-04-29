package repository

import (
	"database/sql"
	"fmt"
	"github.com/grawizah/backend/internal/models"
)

// ProductRepository implements the Repository interface for Product
type ProductRepository struct {
	db *sql.DB
}

// NewProductRepository creates a new product repository
func NewProductRepository(db *sql.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

// Create inserts a new product
func (r *ProductRepository) Create(product *models.Product) error {
	query := `
		INSERT INTO products (
			id, company_id, name, description, hs_code, hs_code_confidence,
			price_range_min, price_range_max, currency, moq, images, category,
			country_origin, listing_score, view_count, inquiry_count,
			created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
	`
	
	_, err := r.db.Exec(query,
		product.ID, product.CompanyID, product.Name, product.Description,
		product.HSCode, product.HSCodeConfidence, product.PriceRangeMin,
		product.PriceRangeMax, product.Currency, product.MOQ, product.Images,
		product.Category, product.CountryOrigin, product.ListingScore,
		product.ViewCount, product.InquiryCount, product.CreatedAt, product.UpdatedAt,
	)
	
	return err
}

// GetByID retrieves a product by ID
func (r *ProductRepository) GetByID(id string) (*models.Product, error) {
	query := `
		SELECT id, company_id, name, description, hs_code, hs_code_confidence,
			price_range_min, price_range_max, currency, moq, images, category,
			country_origin, listing_score, view_count, inquiry_count,
			created_at, updated_at, deleted_at
		FROM products
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	product := &models.Product{}
	err := r.db.QueryRow(query, id).Scan(
		&product.ID, &product.CompanyID, &product.Name, &product.Description,
		&product.HSCode, &product.HSCodeConfidence, &product.PriceRangeMin,
		&product.PriceRangeMax, &product.Currency, &product.MOQ, &product.Images,
		&product.Category, &product.CountryOrigin, &product.ListingScore,
		&product.ViewCount, &product.InquiryCount, &product.CreatedAt,
		&product.UpdatedAt, &product.DeletedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	return product, err
}

// GetAll retrieves all products with pagination
func (r *ProductRepository) GetAll(limit, offset int) ([]models.Product, error) {
	query := `
		SELECT id, company_id, name, description, hs_code, hs_code_confidence,
			price_range_min, price_range_max, currency, moq, images, category,
			country_origin, listing_score, view_count, inquiry_count,
			created_at, updated_at
		FROM products
		WHERE deleted_at IS NULL
		ORDER BY listing_score DESC, view_count DESC
		LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var products []models.Product
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID, &p.CompanyID, &p.Name, &p.Description,
			&p.HSCode, &p.HSCodeConfidence, &p.PriceRangeMin,
			&p.PriceRangeMax, &p.Currency, &p.MOQ, &p.Images,
			&p.Category, &p.CountryOrigin, &p.ListingScore,
			&p.ViewCount, &p.InquiryCount, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	
	return products, nil
}

// Update updates an existing product
func (r *ProductRepository) Update(product *models.Product) error {
	query := `
		UPDATE products SET
			name = $2, description = $3, hs_code = $4, hs_code_confidence = $5,
			price_range_min = $6, price_range_max = $7, currency = $8, moq = $9,
			images = $10, category = $11, country_origin = $12, listing_score = $13,
			view_count = $14, inquiry_count = $15, updated_at = $16
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	result, err := r.db.Exec(query,
		product.ID, product.Name, product.Description, product.HSCode,
		product.HSCodeConfidence, product.PriceRangeMin, product.PriceRangeMax,
		product.Currency, product.MOQ, product.Images, product.Category,
		product.CountryOrigin, product.ListingScore, product.ViewCount,
		product.InquiryCount, product.UpdatedAt,
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

// Delete soft deletes a product
func (r *ProductRepository) Delete(id string) error {
	query := `UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	
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

// GetByCompanyID retrieves all products for a company
func (r *ProductRepository) GetByCompanyID(companyID string) ([]models.Product, error) {
	query := `
		SELECT id, company_id, name, description, hs_code, hs_code_confidence,
			price_range_min, price_range_max, currency, moq, images, category,
			country_origin, listing_score, view_count, inquiry_count,
			created_at, updated_at
		FROM products
		WHERE company_id = $1 AND deleted_at IS NULL
		ORDER BY created_at DESC
	`
	
	rows, err := r.db.Query(query, companyID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var products []models.Product
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID, &p.CompanyID, &p.Name, &p.Description,
			&p.HSCode, &p.HSCodeConfidence, &p.PriceRangeMin,
			&p.PriceRangeMax, &p.Currency, &p.MOQ, &p.Images,
			&p.Category, &p.CountryOrigin, &p.ListingScore,
			&p.ViewCount, &p.InquiryCount, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	
	return products, nil
}

// Search searches products by name, description, or category
func (r *ProductRepository) Search(query string, limit, offset int) ([]models.Product, error) {
	searchQuery := `
		SELECT id, company_id, name, description, hs_code, hs_code_confidence,
			price_range_min, price_range_max, currency, moq, images, category,
			country_origin, listing_score, view_count, inquiry_count,
			created_at, updated_at
		FROM products
		WHERE deleted_at IS NULL
			AND (name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1)
		ORDER BY listing_score DESC
		LIMIT $2 OFFSET $3
	`
	
	searchPattern := fmt.Sprintf("%%%s%%", query)
	rows, err := r.db.Query(searchQuery, searchPattern, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var products []models.Product
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID, &p.CompanyID, &p.Name, &p.Description,
			&p.HSCode, &p.HSCodeConfidence, &p.PriceRangeMin,
			&p.PriceRangeMax, &p.Currency, &p.MOQ, &p.Images,
			&p.Category, &p.CountryOrigin, &p.ListingScore,
			&p.ViewCount, &p.InquiryCount, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	
	return products, nil
}

// IncrementViewCount increments the view count for a product
func (r *ProductRepository) IncrementViewCount(id string) error {
	query := `UPDATE products SET view_count = view_count + 1, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

// IncrementInquiryCount increments the inquiry count for a product
func (r *ProductRepository) IncrementInquiryCount(id string) error {
	query := `UPDATE products SET inquiry_count = inquiry_count + 1, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
