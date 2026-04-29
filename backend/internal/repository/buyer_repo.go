package repository

import (
	"database/sql"
	"fmt"
	"github.com/grawizah/backend/internal/models"
)

// BuyerRepository implements the Repository interface for Buyer
type BuyerRepository struct {
	db *sql.DB
}

// NewBuyerRepository creates a new buyer repository
func NewBuyerRepository(db *sql.DB) *BuyerRepository {
	return &BuyerRepository{db: db}
}

// Create inserts a new buyer
func (r *BuyerRepository) Create(buyer *models.Buyer) error {
	query := `
		INSERT INTO buyers (
			id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
	`
	
	_, err := r.db.Exec(query,
		buyer.ID, buyer.CompanyName, buyer.Country, buyer.BuyScore,
		buyer.Verified, buyer.LastImportDate, buyer.DataSource,
		buyer.ImportVolume, buyer.ImportValue, buyer.HSCodes,
		buyer.ContactEmail, buyer.ContactPhone, buyer.Website,
		buyer.CreatedAt, buyer.UpdatedAt,
	)
	
	return err
}

// GetByID retrieves a buyer by ID
func (r *BuyerRepository) GetByID(id string) (*models.Buyer, error) {
	query := `
		SELECT id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		FROM buyers
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	buyer := &models.Buyer{}
	err := r.db.QueryRow(query, id).Scan(
		&buyer.ID, &buyer.CompanyName, &buyer.Country, &buyer.BuyScore,
		&buyer.Verified, &buyer.LastImportDate, &buyer.DataSource,
		&buyer.ImportVolume, &buyer.ImportValue, &buyer.HSCodes,
		&buyer.ContactEmail, &buyer.ContactPhone, &buyer.Website,
		&buyer.CreatedAt, &buyer.UpdatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, models.ErrNotFound
	}
	
	return buyer, err
}

// GetAll retrieves all buyers with pagination
func (r *BuyerRepository) GetAll(limit, offset int) ([]models.Buyer, error) {
	query := `
		SELECT id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		FROM buyers
		WHERE deleted_at IS NULL
		ORDER BY buy_score DESC
		LIMIT $1 OFFSET $2
	`
	
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var buyers []models.Buyer
	for rows.Next() {
		var b models.Buyer
		err := rows.Scan(
			&b.ID, &b.CompanyName, &b.Country, &b.BuyScore,
			&b.Verified, &b.LastImportDate, &b.DataSource,
			&b.ImportVolume, &b.ImportValue, &b.HSCodes,
			&b.ContactEmail, &b.ContactPhone, &b.Website,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		buyers = append(buyers, b)
	}
	
	return buyers, nil
}

// Update updates an existing buyer
func (r *BuyerRepository) Update(buyer *models.Buyer) error {
	query := `
		UPDATE buyers SET
			company_name = $2, country = $3, buy_score = $4, verified = $5,
			last_import_date = $6, data_source = $7, import_volume = $8,
			import_value = $9, hs_codes = $10, contact_email = $11,
			contact_phone = $12, website = $13, updated_at = $14
		WHERE id = $1 AND deleted_at IS NULL
	`
	
	result, err := r.db.Exec(query,
		buyer.ID, buyer.CompanyName, buyer.Country, buyer.BuyScore,
		buyer.Verified, buyer.LastImportDate, buyer.DataSource,
		buyer.ImportVolume, buyer.ImportValue, buyer.HSCodes,
		buyer.ContactEmail, buyer.ContactPhone, buyer.Website,
		buyer.UpdatedAt,
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

// Delete soft deletes a buyer
func (r *BuyerRepository) Delete(id string) error {
	query := `UPDATE buyers SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	
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

// Search searches buyers by company name or country
func (r *BuyerRepository) Search(criteria models.BuyerSearchCriteria) ([]models.Buyer, error) {
	query := `
		SELECT id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		FROM buyers
		WHERE deleted_at IS NULL
	`
	
	args := []interface{}{}
	argCount := 1
	
	if criteria.Country != "" {
		query += fmt.Sprintf(" AND country = $%d", argCount)
		args = append(args, criteria.Country)
		argCount++
	}
	
	if criteria.MinBuyScore > 0 {
		query += fmt.Sprintf(" AND buy_score >= $%d", argCount)
		args = append(args, criteria.MinBuyScore)
		argCount++
	}
	
	if criteria.MaxBuyScore > 0 {
		query += fmt.Sprintf(" AND buy_score <= $%d", argCount)
		args = append(args, criteria.MaxBuyScore)
		argCount++
	}
	
	if criteria.Verified != nil {
		query += fmt.Sprintf(" AND verified = $%d", argCount)
		args = append(args, *criteria.Verified)
		argCount++
	}
	
	if criteria.DataSource != "" {
		query += fmt.Sprintf(" AND data_source = $%d", argCount)
		args = append(args, criteria.DataSource)
		argCount++
	}
	
	query += " ORDER BY buy_score DESC"
	
	if criteria.Limit > 0 {
		query += fmt.Sprintf(" LIMIT $%d", argCount)
		args = append(args, criteria.Limit)
		argCount++
	}
	
	if criteria.Offset > 0 {
		query += fmt.Sprintf(" OFFSET $%d", argCount)
		args = append(args, criteria.Offset)
	}
	
	rows, err := r.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var buyers []models.Buyer
	for rows.Next() {
		var b models.Buyer
		err := rows.Scan(
			&b.ID, &b.CompanyName, &b.Country, &b.BuyScore,
			&b.Verified, &b.LastImportDate, &b.DataSource,
			&b.ImportVolume, &b.ImportValue, &b.HSCodes,
			&b.ContactEmail, &b.ContactPhone, &b.Website,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		buyers = append(buyers, b)
	}
	
	return buyers, nil
}

// GetByCountry retrieves all buyers from a specific country
func (r *BuyerRepository) GetByCountry(country string) ([]models.Buyer, error) {
	query := `
		SELECT id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		FROM buyers
		WHERE country = $1 AND deleted_at IS NULL
		ORDER BY buy_score DESC
	`
	
	rows, err := r.db.Query(query, country)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var buyers []models.Buyer
	for rows.Next() {
		var b models.Buyer
		err := rows.Scan(
			&b.ID, &b.CompanyName, &b.Country, &b.BuyScore,
			&b.Verified, &b.LastImportDate, &b.DataSource,
			&b.ImportVolume, &b.ImportValue, &b.HSCodes,
			&b.ContactEmail, &b.ContactPhone, &b.Website,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		buyers = append(buyers, b)
	}
	
	return buyers, nil
}

// GetHighQualityBuyers retrieves buyers with buy_score >= 70
func (r *BuyerRepository) GetHighQualityBuyers(limit int) ([]models.Buyer, error) {
	query := `
		SELECT id, company_name, country, buy_score, verified, last_import_date,
			data_source, import_volume, import_value, hs_codes, contact_email,
			contact_phone, website, created_at, updated_at
		FROM buyers
		WHERE buy_score >= 70 AND deleted_at IS NULL
		ORDER BY buy_score DESC
		LIMIT $1
	`
	
	rows, err := r.db.Query(query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	
	var buyers []models.Buyer
	for rows.Next() {
		var b models.Buyer
		err := rows.Scan(
			&b.ID, &b.CompanyName, &b.Country, &b.BuyScore,
			&b.Verified, &b.LastImportDate, &b.DataSource,
			&b.ImportVolume, &b.ImportValue, &b.HSCodes,
			&b.ContactEmail, &b.ContactPhone, &b.Website,
			&b.CreatedAt, &b.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		buyers = append(buyers, b)
	}
	
	return buyers, nil
}
