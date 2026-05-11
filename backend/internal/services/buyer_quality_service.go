package services

import "math/rand"

type BuyerQualityService struct{}

func NewBuyerQualityService() *BuyerQualityService {
	return &BuyerQualityService{}
}

type BuyerQualityScore struct {
	BuyerID           string  `json:"buyer_id"`
	OverallScore      int     `json:"overall_score"`
	VerifiedStatus    bool    `json:"verified_status"`
	BuyHistoryCount   int     `json:"buy_history_count"`
	ResponseSeriousness float64 `json:"response_seriousness"` // 0.0 to 1.0
	LastActive        string  `json:"last_active"`
}

// GetQualityScore generates a score based on buyer data
func (s *BuyerQualityService) GetQualityScore(buyerID string) (*BuyerQualityScore, error) {
	// In a real app, this would fetch data from the DB/Trade logs
	score := 60 + rand.Intn(40)
	return &BuyerQualityScore{
		BuyerID:           buyerID,
		OverallScore:      score,
		VerifiedStatus:    score > 80,
		BuyHistoryCount:   rand.Intn(50),
		ResponseSeriousness: 0.5 + rand.Float64()*0.5,
		LastActive:        "2024-05-10",
	}, nil
}
