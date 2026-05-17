package models

// Company represents a trading company (supplier) in the system
type Company struct {
	BaseEntity
	OwnerID              string   `json:"owner_id" db:"owner_id"`
	Name                 string   `json:"name" db:"name"`
	Country              string   `json:"country" db:"country"`
	Verified             bool     `json:"verified" db:"verified"`
	NIB                  string   `json:"nib,omitempty" db:"nib"`                     // Business Identification Number
	NPWP                 string   `json:"npwp,omitempty" db:"npwp"`                   // Tax ID
	ExportLicense        string   `json:"export_license,omitempty" db:"export_license"`
	ExportExperienceYears *int                 `json:"export_experience_years" db:"export_experience_years"`
	ExportCountries       ResilientStringArray `json:"export_countries,omitempty" db:"export_countries"`
	
	// Additional fields
	Description          string               `json:"description,omitempty" db:"description"`
	Website              string               `json:"website,omitempty" db:"website"`
	ContactEmail         string               `json:"contact_email,omitempty" db:"contact_email"`
	ContactPhone         string               `json:"contact_phone,omitempty" db:"contact_phone"`
	Address              string               `json:"address,omitempty" db:"address"`
	Certifications       ResilientStringArray `json:"certifications,omitempty" db:"certifications"`
	LogoURL              string   `json:"logo_url,omitempty" db:"logo_url"`
	BusinessType         string   `json:"business_type,omitempty" db:"business_type"`
	YearEstablished      *int     `json:"year_established,omitempty" db:"year_established"`
	TotalEmployees       string   `json:"total_employees,omitempty" db:"total_employees"`
	Score                int      `json:"score,omitempty" db:"score"`
}

// NewCompany creates a new company instance
func NewCompany(ownerID, name, country string) *Company {
	return &Company{
		BaseEntity:            NewBaseEntity(),
		OwnerID:               ownerID,
		Name:                  name,
		Country:               country,
		Verified:              false,
		ExportExperienceYears: new(int),
		ExportCountries:       []string{},
		Certifications:        []string{},
	}
}

// Verify marks the company as verified
func (c *Company) Verify() {
	c.Verified = true
	c.UpdateTimestamp()
}

// AddExportCountry adds a country to the export countries list
func (c *Company) AddExportCountry(country string) {
	for _, existing := range c.ExportCountries {
		if existing == country {
			return // Already exists
		}
	}
	c.ExportCountries = append(c.ExportCountries, country)
	c.UpdateTimestamp()
}

// AddCertification adds a certification to the company
func (c *Company) AddCertification(cert string) {
	for _, existing := range c.Certifications {
		if existing == cert {
			return // Already exists
		}
	}
	c.Certifications = append(c.Certifications, cert)
	c.UpdateTimestamp()
}

// UpdateExportExperience updates the export experience years
func (c *Company) UpdateExportExperience(years int) error {
	if years < 0 {
		return ErrInvalidInput
	}
	c.ExportExperienceYears = &years
	c.UpdateTimestamp()
	return nil
}

// IsVerified checks if the company is verified
func (c *Company) IsVerified() bool {
	return c.Verified
}

// HasCertification checks if the company has a specific certification
func (c *Company) HasCertification(cert string) bool {
	for _, existing := range c.Certifications {
		if existing == cert {
			return true
		}
	}
	return false
}

// ExportsTo checks if the company exports to a specific country
func (c *Company) ExportsTo(country string) bool {
	for _, existing := range c.ExportCountries {
		if existing == country {
			return true
		}
	}
	return false
}

// GetExperienceLevel returns the experience level based on years
func (c *Company) GetExperienceLevel() string {
	if c.ExportExperienceYears == nil {
		return "Beginner"
	}
	years := *c.ExportExperienceYears
	if years >= 10 {
		return "Expert"
	} else if years >= 5 {
		return "Experienced"
	} else if years >= 2 {
		return "Intermediate"
	}
	return "Beginner"
}
