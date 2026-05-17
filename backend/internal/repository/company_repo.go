package repository

import (
	"database/sql"

	"github.com/grawizah/backend/internal/models"
	"github.com/lib/pq"
)

type CompanyRepository struct {
	db *sql.DB
}

func NewCompanyRepository(db *sql.DB) *CompanyRepository {
	return &CompanyRepository{db: db}
}

// GetByID fetches company by primary key — matches schema.sql columns exactly
func (r *CompanyRepository) Create(c *models.Company) error {
	query := `
		INSERT INTO companies (
			id, owner_id, name, country, verified, score, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`
	_, err := r.db.Exec(query,
		c.ID, c.OwnerID, c.Name, c.Country, c.Verified, c.Score, c.CreatedAt, c.UpdatedAt,
	)
	return err
}

// GetByID fetches company by primary key — matches schema.sql columns exactly
func (r *CompanyRepository) GetByID(id string) (*models.Company, error) {
	query := `
		SELECT id, owner_id, name, country, verified,
		       nib, npwp, export_license,
		       export_experience_years, export_countries,
		       description, website, contact_email, contact_phone,
		       address, certifications, logo_url, business_type,
		       year_established, total_employees, score,
		       created_at, updated_at
		FROM companies
		WHERE id = $1 AND deleted_at IS NULL
	`

	var c models.Company
	var (
		ownerID         sql.NullString
		country         sql.NullString
		nib             sql.NullString
		npwp            sql.NullString
		exportLicense   sql.NullString
		description     sql.NullString
		website         sql.NullString
		contactEmail    sql.NullString
		contactPhone    sql.NullString
		address         sql.NullString
		logoURL         sql.NullString
		businessType    sql.NullString
		totalEmployees  sql.NullString
	)

	err := r.db.QueryRow(query, id).Scan(
		&c.ID, &ownerID, &c.Name, &country, &c.Verified,
		&nib, &npwp, &exportLicense,
		&c.ExportExperienceYears, &c.ExportCountries,
		&description, &website, &contactEmail, &contactPhone,
		&address, &c.Certifications, &logoURL, &businessType,
		&c.YearEstablished, &totalEmployees, &c.Score,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}

	// Map null strings back to model
	c.OwnerID = ownerID.String
	c.Country = country.String
	c.NIB = nib.String
	c.NPWP = npwp.String
	c.ExportLicense = exportLicense.String
	c.Description = description.String
	c.Website = website.String
	c.ContactEmail = contactEmail.String
	c.ContactPhone = contactPhone.String
	c.Address = address.String
	c.LogoURL = logoURL.String
	c.BusinessType = businessType.String
	c.TotalEmployees = totalEmployees.String

	return &c, nil
}

// GetByUserID fetches company by owner_id (references users.id)
func (r *CompanyRepository) GetByUserID(userID string) (*models.Company, error) {
	query := `
		SELECT id, owner_id, name, country, verified,
		       nib, npwp, export_license,
		       export_experience_years, export_countries,
		       description, website, contact_email, contact_phone,
		       address, certifications, logo_url, business_type,
		       year_established, total_employees, score,
		       created_at, updated_at
		FROM companies
		WHERE owner_id = $1 AND deleted_at IS NULL
		LIMIT 1
	`

	var c models.Company
	var (
		ownerID         sql.NullString
		country         sql.NullString
		nib             sql.NullString
		npwp            sql.NullString
		exportLicense   sql.NullString
		description     sql.NullString
		website         sql.NullString
		contactEmail    sql.NullString
		contactPhone    sql.NullString
		address         sql.NullString
		logoURL         sql.NullString
		businessType    sql.NullString
		totalEmployees  sql.NullString
	)

	err := r.db.QueryRow(query, userID).Scan(
		&c.ID, &ownerID, &c.Name, &country, &c.Verified,
		&nib, &npwp, &exportLicense,
		&c.ExportExperienceYears, &c.ExportCountries,
		&description, &website, &contactEmail, &contactPhone,
		&address, &c.Certifications, &logoURL, &businessType,
		&c.YearEstablished, &totalEmployees, &c.Score,
		&c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, models.ErrNotFound
		}
		return nil, err
	}

	// Map null strings back to model
	c.OwnerID = ownerID.String
	c.Country = country.String
	c.NIB = nib.String
	c.NPWP = npwp.String
	c.ExportLicense = exportLicense.String
	c.Description = description.String
	c.Website = website.String
	c.ContactEmail = contactEmail.String
	c.ContactPhone = contactPhone.String
	c.Address = address.String
	c.LogoURL = logoURL.String
	c.BusinessType = businessType.String
	c.TotalEmployees = totalEmployees.String

	return &c, nil
}

// GetAll fetches all companies for directory/catalog views
func (r *CompanyRepository) GetAll() ([]models.Company, error) {
	query := `
		SELECT id, owner_id, name, country, verified,
		       nib, npwp, export_license,
		       export_experience_years, export_countries,
		       description, website, contact_email, contact_phone,
		       address, certifications, logo_url, business_type,
		       year_established, total_employees, score,
		       created_at, updated_at
		FROM companies
		WHERE deleted_at IS NULL
		ORDER BY score DESC, name ASC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var companies []models.Company
	for rows.Next() {
		var c models.Company
		var (
			ownerID         sql.NullString
			country         sql.NullString
			nib             sql.NullString
			npwp            sql.NullString
			exportLicense   sql.NullString
			description     sql.NullString
			website         sql.NullString
			contactEmail    sql.NullString
			contactPhone    sql.NullString
			address         sql.NullString
			logoURL         sql.NullString
			businessType    sql.NullString
			totalEmployees  sql.NullString
		)

		err := rows.Scan(
			&c.ID, &ownerID, &c.Name, &country, &c.Verified,
			&nib, &npwp, &exportLicense,
			&c.ExportExperienceYears, &c.ExportCountries,
			&description, &website, &contactEmail, &contactPhone,
			&address, &c.Certifications, &logoURL, &businessType,
			&c.YearEstablished, &totalEmployees, &c.Score,
			&c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		c.OwnerID = ownerID.String
		c.Country = country.String
		c.NIB = nib.String
		c.NPWP = npwp.String
		c.ExportLicense = exportLicense.String
		c.Description = description.String
		c.Website = website.String
		c.ContactEmail = contactEmail.String
		c.ContactPhone = contactPhone.String
		c.Address = address.String
		c.LogoURL = logoURL.String
		c.BusinessType = businessType.String
		c.TotalEmployees = totalEmployees.String

		companies = append(companies, c)
	}

	return companies, nil
}

// Update updates an existing company's metadata in the database
func (r *CompanyRepository) Update(c *models.Company) error {
	query := `
		UPDATE companies
		SET name = $1,
		    business_type = $2,
		    certifications = $3,
		    country = $4,
		    logo_url = $5,
		    updated_at = NOW()
		WHERE id = $6 AND deleted_at IS NULL
	`
	_, err := r.db.Exec(query,
		c.Name, c.BusinessType, pq.Array([]string(c.Certifications)), c.Country, c.LogoURL, c.ID,
	)
	return err
}

