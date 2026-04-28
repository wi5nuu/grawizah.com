package models

// Product model - inherits BaseEntity through embedding
type Product struct {
	BaseEntity
	CompanyID          string   `json:"company_id" db:"company_id"`
	Name               string   `json:"name" db:"name"`
	Description        string   `json:"description" db:"description"`
	HSCode             *string  `json:"hs_code,omitempty" db:"hs_code"`
	HSCodeConfidence   *float64 `json:"hs_code_confidence,omitempty" db:"hs_code_confidence"`
	PriceRangeMin      *float64 `json:"price_range_min,omitempty" db:"price_range_min"`
	PriceRangeMax      *float64 `json:"price_range_max,omitempty" db:"price_range_max"`
	Currency           string   `json:"currency" db:"currency"`
	MOQ                *int     `json:"moq,omitempty" db:"moq"`
	Images             []string `json:"images" db:"images"`
	Category           string   `json:"category" db:"category"`
	CountryOrigin      string   `json:"country_origin" db:"country_origin"`
	ListingScore       *int     `json:"listing_score,omitempty" db:"listing_score"`
	ViewCount          int      `json:"view_count" db:"view_count"`
	InquiryCount       int      `json:"inquiry_count" db:"inquiry_count"`
}

// SetPriceRange sets price range with validation
func (p *Product) SetPriceRange(min, max float64, currency string) error {
	if min > max {
		return ErrInvalidPriceRange
	}
	p.PriceRangeMin = &min
	p.PriceRangeMax = &max
	p.Currency = currency
	return nil
}

// IncrementViewCount increments view counter
func (p *Product) IncrementViewCount() {
	p.ViewCount++
}

// IncrementInquiryCount increments inquiry counter
func (p *Product) IncrementInquiryCount() {
	p.InquiryCount++
}

// CalculateListingScore calculates product listing completeness score
func (p *Product) CalculateListingScore() int {
	score := 0
	
	if len(p.Name) > 10 {
		score += 20
	}
	if len(p.Description) > 50 {
		score += 20
	}
	if p.HSCode != nil {
		score += 20
	}
	if len(p.Images) >= 3 {
		score += 20
	}
	if p.PriceRangeMin != nil && p.PriceRangeMax != nil {
		score += 20
	}
	
	p.ListingScore = &score
	return score
}
