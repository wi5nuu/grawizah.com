package models

// LeaderboardScore represents a company's performance score
type LeaderboardScore struct {
	BaseEntity
	CompanyID            string  `json:"company_id" db:"company_id"`
	ConversionRate       float64 `json:"conversion_rate" db:"conversion_rate"`             // 0-100
	RepeatBuyerRate      float64 `json:"repeat_buyer_rate" db:"repeat_buyer_rate"`         // 0-100
	ResponseRate         float64 `json:"response_rate" db:"response_rate"`                 // 0-100
	BuyerRating          float64 `json:"buyer_rating" db:"buyer_rating"`                   // 0-5
	CatalogCompleteness  int     `json:"catalog_completeness" db:"catalog_completeness"`   // 0-100
	FulfillmentSuccess   float64 `json:"fulfillment_success" db:"fulfillment_success"`     // 0-100
	TotalScore           float64 `json:"total_score" db:"total_score"`                     // Calculated
	Rank                 int     `json:"rank" db:"rank"`
	Trend7d              float64 `json:"trend_7d,omitempty" db:"trend_7d"`                 // Change in last 7 days
	
	// Additional metadata
	CompanyName          string  `json:"company_name,omitempty"`
	Country              string  `json:"country,omitempty"`
	LogoURL              string  `json:"logo_url,omitempty"`
}

// NewLeaderboardScore creates a new leaderboard score instance
func NewLeaderboardScore(companyID string) *LeaderboardScore {
	return &LeaderboardScore{
		BaseEntity:          NewBaseEntity(),
		CompanyID:           companyID,
		ConversionRate:      0,
		RepeatBuyerRate:     0,
		ResponseRate:        0,
		BuyerRating:         0,
		CatalogCompleteness: 0,
		FulfillmentSuccess:  0,
		TotalScore:          0,
		Rank:                0,
	}
}

// CalculateTotalScore calculates the total score based on weighted metrics
func (ls *LeaderboardScore) CalculateTotalScore() {
	// Weighted formula:
	// - Conversion Rate: 30%
	// - Repeat Buyer Rate: 20%
	// - Response Rate: 15%
	// - Buyer Rating: 15% (scaled to 100)
	// - Catalog Completeness: 10%
	// - Fulfillment Success: 10%
	
	ls.TotalScore = (ls.ConversionRate * 0.30) +
		(ls.RepeatBuyerRate * 0.20) +
		(ls.ResponseRate * 0.15) +
		(ls.BuyerRating * 15) + // 5 * 15 = 75 max
		(float64(ls.CatalogCompleteness) * 0.10) +
		(ls.FulfillmentSuccess * 0.10)
	
	ls.UpdateTimestamp()
}

// UpdateConversionRate updates the conversion rate and recalculates total score
func (ls *LeaderboardScore) UpdateConversionRate(rate float64) error {
	if rate < 0 || rate > 100 {
		return ErrInvalidInput
	}
	ls.ConversionRate = rate
	ls.CalculateTotalScore()
	return nil
}

// UpdateRepeatBuyerRate updates the repeat buyer rate and recalculates total score
func (ls *LeaderboardScore) UpdateRepeatBuyerRate(rate float64) error {
	if rate < 0 || rate > 100 {
		return ErrInvalidInput
	}
	ls.RepeatBuyerRate = rate
	ls.CalculateTotalScore()
	return nil
}

// UpdateResponseRate updates the response rate and recalculates total score
func (ls *LeaderboardScore) UpdateResponseRate(rate float64) error {
	if rate < 0 || rate > 100 {
		return ErrInvalidInput
	}
	ls.ResponseRate = rate
	ls.CalculateTotalScore()
	return nil
}

// UpdateBuyerRating updates the buyer rating and recalculates total score
func (ls *LeaderboardScore) UpdateBuyerRating(rating float64) error {
	if rating < 0 || rating > 5 {
		return ErrInvalidInput
	}
	ls.BuyerRating = rating
	ls.CalculateTotalScore()
	return nil
}

// UpdateCatalogCompleteness updates the catalog completeness and recalculates total score
func (ls *LeaderboardScore) UpdateCatalogCompleteness(completeness int) error {
	if completeness < 0 || completeness > 100 {
		return ErrInvalidInput
	}
	ls.CatalogCompleteness = completeness
	ls.CalculateTotalScore()
	return nil
}

// UpdateFulfillmentSuccess updates the fulfillment success rate and recalculates total score
func (ls *LeaderboardScore) UpdateFulfillmentSuccess(rate float64) error {
	if rate < 0 || rate > 100 {
		return ErrInvalidInput
	}
	ls.FulfillmentSuccess = rate
	ls.CalculateTotalScore()
	return nil
}

// SetRank sets the rank of the company
func (ls *LeaderboardScore) SetRank(rank int) {
	ls.Rank = rank
	ls.UpdateTimestamp()
}

// UpdateTrend updates the 7-day trend
func (ls *LeaderboardScore) UpdateTrend(previousScore float64) {
	ls.Trend7d = ls.TotalScore - previousScore
	ls.UpdateTimestamp()
}

// GetPerformanceTier returns the performance tier based on total score
func (ls *LeaderboardScore) GetPerformanceTier() string {
	if ls.TotalScore >= 80 {
		return "Excellent"
	} else if ls.TotalScore >= 60 {
		return "Good"
	} else if ls.TotalScore >= 40 {
		return "Average"
	}
	return "Needs Improvement"
}

// IsTopPerformer checks if the company is in the top 10
func (ls *LeaderboardScore) IsTopPerformer() bool {
	return ls.Rank > 0 && ls.Rank <= 10
}

// LeaderboardComparison represents a comparison between companies
type LeaderboardComparison struct {
	MyScore         LeaderboardScore   `json:"my_score"`
	CompetitorScore LeaderboardScore   `json:"competitor_score"`
	Differences     map[string]float64 `json:"differences"`
}

// CompareWith compares this score with another company's score
func (ls *LeaderboardScore) CompareWith(other *LeaderboardScore) LeaderboardComparison {
	return LeaderboardComparison{
		MyScore:         *ls,
		CompetitorScore: *other,
		Differences: map[string]float64{
			"total_score":          ls.TotalScore - other.TotalScore,
			"conversion_rate":      ls.ConversionRate - other.ConversionRate,
			"repeat_buyer_rate":    ls.RepeatBuyerRate - other.RepeatBuyerRate,
			"response_rate":        ls.ResponseRate - other.ResponseRate,
			"buyer_rating":         ls.BuyerRating - other.BuyerRating,
			"catalog_completeness": float64(ls.CatalogCompleteness - other.CatalogCompleteness),
			"fulfillment_success":  ls.FulfillmentSuccess - other.FulfillmentSuccess,
		},
	}
}
