package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

// ResilientStringArray is a slice of strings that is extremely robust when scanning array values from PostgreSQL / Supabase
type ResilientStringArray []string

// Scan implements the sql.Scanner interface
func (a *ResilientStringArray) Scan(src interface{}) error {
	if src == nil {
		*a = make(ResilientStringArray, 0)
		return nil
	}

	switch v := src.(type) {
	case []byte:
		return a.scanBytes(v)
	case string:
		return a.scanBytes([]byte(v))
	default:
		// Fallback to standard pq.StringArray scanner
		var psa pq.StringArray
		if err := psa.Scan(src); err == nil {
			*a = ResilientStringArray(psa)
			return nil
		}
		return fmt.Errorf("unsupported source type for ResilientStringArray: %T", src)
	}
}

func (a *ResilientStringArray) scanBytes(b []byte) error {
	if len(b) == 0 {
		*a = make(ResilientStringArray, 0)
		return nil
	}

	str := string(b)

	// Format 1: JSON array e.g. ["img1", "img2"]
	if strings.HasPrefix(str, "[") && strings.HasSuffix(str, "]") {
		var slice []string
		if err := json.Unmarshal(b, &slice); err == nil {
			*a = ResilientStringArray(slice)
			return nil
		}
	}

	// Format 2: PostgreSQL native array e.g. {img1,img2}
	if strings.HasPrefix(str, "{") && strings.HasSuffix(str, "}") {
		var psa pq.StringArray
		if err := psa.Scan(b); err == nil {
			*a = ResilientStringArray(psa)
			return nil
		}
	}

	// Format 3: Comma separated values
	if str != "" {
		parts := strings.Split(str, ",")
		for i := range parts {
			parts[i] = strings.Trim(parts[i], `" `)
		}
		*a = ResilientStringArray(parts)
		return nil
	}

	*a = make(ResilientStringArray, 0)
	return nil
}

// Value implements the driver.Valuer interface
func (a ResilientStringArray) Value() (driver.Value, error) {
	if len(a) == 0 {
		return "{}", nil
	}
	return pq.StringArray(a).Value()
}

// Product model - inherits BaseEntity through embedding
type Product struct {
	BaseEntity
	CompanyID        string               `json:"company_id" db:"company_id"`
	Name             string               `json:"name" db:"name"`
	Description      string               `json:"description" db:"description"`
	HSCode           *string              `json:"hs_code,omitempty" db:"hs_code"`
	HSCodeConfidence *float64             `json:"hs_code_confidence,omitempty" db:"hs_code_confidence"`
	PriceRangeMin    *float64             `json:"price_range_min,omitempty" db:"price_range_min"`
	PriceRangeMax    *float64             `json:"price_range_max,omitempty" db:"price_range_max"`
	Currency         string               `json:"currency" db:"currency"`
	MOQ              *int                 `json:"moq,omitempty" db:"moq"`
	Images           ResilientStringArray `json:"images" db:"images"`
	Category         string               `json:"category" db:"category"`
	CountryOrigin    string               `json:"country_origin" db:"country_origin"`
	ListingScore     *int                 `json:"listing_score,omitempty" db:"listing_score"`
	ViewCount        int                  `json:"view_count" db:"view_count"`
	InquiryCount     int                  `json:"inquiry_count" db:"inquiry_count"`
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
