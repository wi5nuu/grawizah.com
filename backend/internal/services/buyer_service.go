package services

import (
	"context"

	"github.com/grawizah/backend/internal/interfaces"
	"github.com/grawizah/backend/internal/models"
)

type BuyerService struct {
	buyerRepo interfaces.BuyerRepository
}

func NewBuyerService(buyerRepo interfaces.BuyerRepository) *BuyerService {
	return &BuyerService{
		buyerRepo: buyerRepo,
	}
}

func (s *BuyerService) GetBuyerRadar(ctx context.Context, limit, offset int) ([]models.Buyer, error) {
	return s.buyerRepo.GetAll(limit, offset)
}

func (s *BuyerService) GetBuyerByID(ctx context.Context, id string) (*models.Buyer, error) {
	return s.buyerRepo.GetByID(id)
}

func (s *BuyerService) SearchBuyers(ctx context.Context, query string) ([]models.Buyer, error) {
	return s.buyerRepo.Search(models.BuyerSearchCriteria{
		Query: query,
	})
}

func (s *BuyerService) GetBuyersByCountry(ctx context.Context, country string) ([]models.Buyer, error) {
	return s.buyerRepo.GetByCountry(country)
}

func (s *BuyerService) GetHighQualityBuyers(ctx context.Context, limit int) ([]models.Buyer, error) {
	return s.buyerRepo.GetHighQualityBuyers(limit)
}

func (s *BuyerService) CalculateLeadScore(ctx context.Context, buyerID string, productCategory string) (map[string]interface{}, error) {
	buyer, err := s.buyerRepo.GetByID(buyerID)
	if err != nil {
		return nil, err
	}

	// Simple lead scoring algorithm
	buyScore := buyer.BuyScore

	return map[string]interface{}{
		"buyer_id":               buyerID,
		"conversion_probability": float64(buyScore) / 100.0,
		"buy_score":              buyScore,
		"factors": map[string]interface{}{
			"import_frequency": 0.85,
			"volume_trend":     0.78,
			"category_match":   0.90,
			"country_affinity": 0.75,
		},
	}, nil
}
