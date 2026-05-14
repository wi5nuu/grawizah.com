package models

import (
	"time"
)

// InquirySourceType represents the source of an inquiry (polymorphic)
type InquirySourceType string

const (
	SourceChat     InquirySourceType = "chat"
	SourceWhatsApp InquirySourceType = "whatsapp"
	SourceEmail    InquirySourceType = "email"
	SourceRFQ      InquirySourceType = "rfq"
)

// InquiryStatus represents the current status of an inquiry
type InquiryStatus string

const (
	StatusOpen      InquiryStatus = "open"
	StatusResponded InquiryStatus = "responded"
	StatusClosed    InquiryStatus = "closed"
)

// Inquiry represents a buyer inquiry to a supplier
type Inquiry struct {
	BaseEntity
	BuyerID            string                 `json:"buyer_id" db:"buyer_id"`
	SupplierID         string                 `json:"supplier_id" db:"supplier_id"`
	ProductID          string                 `json:"product_id" db:"product_id"`
	Message            string                 `json:"message" db:"message"`
	SourceType         InquirySourceType      `json:"source_type" db:"source_type"`
	SourceMetadata     map[string]interface{} `json:"source_metadata" db:"source_metadata"` // Polymorphic metadata
	Status             InquiryStatus          `json:"status" db:"status"`
	ResponseTimeHours  *float64               `json:"response_time_hours,omitempty" db:"response_time_hours"`
	ConvertedToDeal    bool                   `json:"converted_to_deal" db:"converted_to_deal"`
	BuyerRating        *int                   `json:"buyer_rating,omitempty" db:"buyer_rating"`
	ResponseMessage    string                 `json:"response_message,omitempty" db:"response_message"`
	RespondedAt        *time.Time             `json:"responded_at,omitempty" db:"responded_at"`
}

// NewInquiry creates a new inquiry instance
func NewInquiry(buyerID, supplierID, productID, message string, sourceType InquirySourceType) *Inquiry {
	return &Inquiry{
		BaseEntity:      NewBaseEntity(),
		BuyerID:         buyerID,
		SupplierID:      supplierID,
		ProductID:       productID,
		Message:         message,
		SourceType:      sourceType,
		Status:          StatusOpen,
		ConvertedToDeal: false,
	}
}

// Respond marks the inquiry as responded
func (i *Inquiry) Respond(message string) {
	i.Status = StatusResponded
	i.ResponseMessage = message
	now := time.Now()
	i.RespondedAt = &now
	
	// Calculate response time in hours
	if i.CreatedAt != nil {
		hours := now.Sub(*i.CreatedAt).Hours()
		i.ResponseTimeHours = &hours
	}
	
	i.UpdateTimestamp()
}

// MarkAsConverted marks the inquiry as converted to a deal
func (i *Inquiry) MarkAsConverted() {
	i.ConvertedToDeal = true
	i.UpdateTimestamp()
}

// Close closes the inquiry
func (i *Inquiry) Close() {
	i.Status = StatusClosed
	i.UpdateTimestamp()
}

// SetBuyerRating sets the buyer's rating for this inquiry
func (i *Inquiry) SetBuyerRating(rating int) error {
	if rating < 1 || rating > 5 {
		return ErrInvalidInput
	}
	i.BuyerRating = &rating
	i.UpdateTimestamp()
	return nil
}

// IsOpen checks if the inquiry is still open
func (i *Inquiry) IsOpen() bool {
	return i.Status == StatusOpen
}

// IsResponded checks if the inquiry has been responded to
func (i *Inquiry) IsResponded() bool {
	return i.Status == StatusResponded
}

// InquiryAnalytics represents analytics data for inquiries
type InquiryAnalytics struct {
	TotalInquiries     int     `json:"total_inquiries"`
	OpenInquiries      int     `json:"open_inquiries"`
	RespondedInquiries int     `json:"responded_inquiries"`
	ConvertedDeals     int     `json:"converted_deals"`
	ConversionRate     float64 `json:"conversion_rate"`
	ResponseRate       float64 `json:"response_rate"`
	AvgResponseTimeHours float64 `json:"avg_response_time_hours"`
	RepeatBuyerRate      float64 `json:"repeat_buyer_rate"`
}

// CalculateAnalytics calculates analytics from a list of inquiries
func CalculateAnalytics(inquiries []Inquiry) InquiryAnalytics {
	analytics := InquiryAnalytics{
		TotalInquiries: len(inquiries),
	}
	
	if len(inquiries) == 0 {
		return analytics
	}
	
	var totalResponseTime float64
	var responseCount int
	uniqueBuyers := make(map[string]int)
	
	for _, inq := range inquiries {
		if inq.Status == StatusOpen {
			analytics.OpenInquiries++
		}
		if inq.Status == StatusResponded || inq.Status == StatusClosed {
			analytics.RespondedInquiries++
		}
		if inq.ConvertedToDeal {
			analytics.ConvertedDeals++
		}
		if inq.ResponseTimeHours != nil {
			totalResponseTime += *inq.ResponseTimeHours
			responseCount++
		}
		
		// Track unique buyers
		uniqueBuyers[inq.BuyerID]++
	}
	
	// Calculate rates
	if analytics.TotalInquiries > 0 {
		analytics.ConversionRate = float64(analytics.ConvertedDeals) / float64(analytics.TotalInquiries) * 100
		analytics.ResponseRate = float64(analytics.RespondedInquiries) / float64(analytics.TotalInquiries) * 100
	}
	
	if responseCount > 0 {
		analytics.AvgResponseTimeHours = totalResponseTime / float64(responseCount)
	}
	
	// Calculate repeat buyer rate
	repeatBuyers := 0
	for _, count := range uniqueBuyers {
		if count > 1 {
			repeatBuyers++
		}
	}
	if len(uniqueBuyers) > 0 {
		analytics.RepeatBuyerRate = float64(repeatBuyers) / float64(len(uniqueBuyers)) * 100
	}
	
	return analytics
}

// InquiryDetail represents an inquiry with joined data
type InquiryDetail struct {
	Inquiry
	BuyerName    string `json:"buyer_name"`
	BuyerCompany string `json:"buyer_company"`
	BuyerCountry string `json:"buyer_country"`
	ProductName  string `json:"product_name"`
}
