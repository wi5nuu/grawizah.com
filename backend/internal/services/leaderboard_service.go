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
func (s *LeaderboardService) GetTopSuppliers() ([]models.LeaderboardScore, error) {
	return s.repo.GetAll(10, 0) // Default limit 10, offset 0
}

// GetCompanyRank returns the leaderboard ranking for a specific company
func (s *LeaderboardService) GetCompanyRank(companyID string) (*models.LeaderboardScore, error) {
	return s.repo.GetByCompanyID(companyID)
}
