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

func (r *CompanyRepository) GetByID(id string) (*models.Company, error) {
	query := `SELECT id, owner_id, name, country, verified, nib, npwp, export_license, export_experience_years, created_at, updated_at FROM companies WHERE id = $1 AND deleted_at IS NULL`
	var c models.Company
	err := r.db.QueryRow(query, id).Scan(
		&c.ID, &c.OwnerID, &c.Name, &c.Country, &c.Verified,
		&c.NIB, &c.NPWP, &c.ExportLicense, &c.ExportExperienceYears,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}
	return &c, nil
}

func (r *CompanyRepository) GetByUserID(userID string) (*models.Company, error) {
	query := `SELECT id, owner_id, name, country, verified, nib, npwp, export_license, export_experience_years, created_at, updated_at FROM companies WHERE owner_id = $1 AND deleted_at IS NULL`
	var c models.Company
	err := r.db.QueryRow(query, userID).Scan(
		&c.ID, &c.OwnerID, &c.Name, &c.Country, &c.Verified,
		&c.NIB, &c.NPWP, &c.ExportLicense, &c.ExportExperienceYears,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}
	return &c, nil
}
