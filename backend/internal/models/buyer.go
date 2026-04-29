package models

import (
	"time"
)

// DataSource represents the source of buyer data
type DataSource string

const (
	DataSourceComtrade  DataSource = "comtrade"
	DataSourceCustoms   DataSource = "customs"
	DataSourceEstimated DataSource = "estimated"
	DataSourceVerified  DataSource = "verified"
)

// Buyer represents a potential buyer in the system
type Buyer struct {
	BaseEntity
	CompanyName    string     `json:"company_name" db:"company_name"`
	Country        string     `json:"country" db:"country"`
	BuyScore       int        `json:"buy_score" db:"buy_score"`           // 0-100 AI-calculated score
	Verified       bool       `json:"verified" db:"verified"`
	LastImportDate *time.Time `json:"last_import_date,omitempty" db:"last_import_date"`
	DataSource     DataSource `json:"data_source" db:"data_source"`
	
	// Additional metadata
	ImportVolume   *float64 `json:"import_volume,omitempty" db:"import_volume"`     // in MT or units
	ImportValue    *float64 `json:"import_value,omitempty" db:"import_value"`       // in USD
	HSCodes        []string `json:"hs_codes,omitempty" db:"hs_codes"`               // Products they import
	ContactEmail   string   `json:"contact_email,omitempty" db:"contact_email"`
	ContactPhone   string   `json:"contact_phone,omitempty" db:"contact_phone"`
	Website        string   `json:"website,omitempty" db:"website"`
}

// NewBuyer creates a new buyer instance
func NewBuyer(companyName, country string, dataSource DataSource) *Buyer {
	return &Buyer{
		BaseEntity:  NewBaseEntity(),
		CompanyName: companyName,
		Country:     country,
		DataSource:  dataSource,
		BuyScore:    0,
		Verified:    false,
	}
}

// UpdateBuyScore updates the buyer's score
func (b *Buyer) UpdateBuyScore(score int) error {
	if score < 0 || score > 100 {
		return ErrInvalidInput
	}
	b.BuyScore = score
	b.UpdateTimestamp()
	return nil
}

// Verify marks the buyer as verified
func (b *Buyer) Verify() {
	b.Verified = true
	b.DataSource = DataSourceVerified
	b.UpdateTimestamp()
}

// UpdateLastImport updates the last import date
func (b *Buyer) UpdateLastImport(date time.Time) {
	b.LastImportDate = &date
	b.UpdateTimestamp()
}

// IsHighQuality checks if the buyer is high quality (score >= 70)
func (b *Buyer) IsHighQuality() bool {
	return b.BuyScore >= 70
}

// IsPremiumLead checks if the buyer is a premium lead (score >= 85)
func (b *Buyer) IsPremiumLead() bool {
	return b.BuyScore >= 85
}

// GetQualityTier returns the quality tier of the buyer
func (b *Buyer) GetQualityTier() string {
	if b.BuyScore >= 85 {
		return "Premium"
	} else if b.BuyScore >= 70 {
		return "High"
	} else if b.BuyScore >= 50 {
		return "Medium"
	}
	return "Low"
}

// BuyerSearchCriteria represents search criteria for buyers
type BuyerSearchCriteria struct {
	Country      string
	MinBuyScore  int
	MaxBuyScore  int
	HSCode       string
	Verified     *bool
	DataSource   DataSource
	Limit        int
	Offset       int
}

// BuyerRadarResult represents a buyer in the radar view
type BuyerRadarResult struct {
	Buyer
	MatchScore      float64 `json:"match_score"`       // How well they match supplier's products
	RecommendedHSCode string `json:"recommended_hs_code,omitempty"`
}
