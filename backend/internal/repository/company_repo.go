package repository

import (
	"database/sql"
	"github.com/grawizah/backend/internal/models"
)

type CompanyRepository struct {
	db *sql.DB
}

func NewCompanyRepository(db *sql.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

func (r *CompanyRepository) GetByID(id string) (map[string]interface{}, error) {
	query := `SELECT id, name, industry, country, verified FROM companies WHERE id = $1`
	var c struct {
		ID       string
		Name     string
		Industry sql.NullString
		Country  sql.NullString
		Verified bool
	}
	err := r.db.QueryRow(query, id).Scan(&c.ID, &c.Name, &c.Industry, &c.Country, &c.Verified)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}
	return map[string]interface{}{
		"id":       c.ID,
		"name":     c.Name,
		"industry": c.Industry.String,
		"country":  c.Country.String,
		"verified": c.Verified,
	}, nil
}

func (r *CompanyRepository) GetByUserID(userID string) (map[string]interface{}, error) {
	// Assuming a link between users and companies exists, e.g., via user_id in companies table
	query := `SELECT id, name, industry, country, verified FROM companies WHERE user_id = $1`
	var c struct {
		ID       string
		Name     string
		Industry sql.NullString
		Country  sql.NullString
		Verified bool
	}
	err := r.db.QueryRow(query, userID).Scan(&c.ID, &c.Name, &c.Industry, &c.Country, &c.Verified)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}
	return map[string]interface{}{
		"id":       c.ID,
		"name":     c.Name,
		"industry": c.Industry.String,
		"country":  c.Country.String,
		"verified": c.Verified,
	}, nil
}
