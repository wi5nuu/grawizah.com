package services

import (
	"github.com/grawizah/backend/internal/interfaces"
	"github.com/grawizah/backend/internal/models"
)

type LeaderboardService struct {
	repo interfaces.LeaderboardRepository
}

func NewLeaderboardService(repo interfaces.LeaderboardRepository) *LeaderboardService {
	return &LeaderboardService{repo: repo}
}

// GetTopSuppliers returns a list of top suppliers based on analytics score
func (s *LeaderboardService) GetTopSuppliers(limit int) ([]models.LeaderboardScore, error) {
	if limit <= 0 {
		limit = 10
	}
	return s.repo.GetAll(limit, 0)
}

// GetCompanyRank returns the leaderboard ranking for a specific company
func (s *LeaderboardService) GetCompanyRank(companyID string) (*models.LeaderboardScore, error) {
	return s.repo.GetByCompanyID(companyID)
}
