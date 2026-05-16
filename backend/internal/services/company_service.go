package services

import (
	"github.com/grawizah/backend/internal/models"
	"github.com/grawizah/backend/internal/repository"
)

type CompanyService struct {
	repo *repository.CompanyRepository
}

func NewCompanyService(repo *repository.CompanyRepository) *CompanyService {
	return &CompanyService{repo: repo}
}

// GetCompanyByID fetches company details by ID
func (s *CompanyService) GetCompanyByID(id string) (*models.Company, error) {
	return s.repo.GetByID(id)
}

// GetMyCompany fetches the company details for the currently authenticated user
func (s *CompanyService) GetMyCompany(userID string) (*models.Company, error) {
	return s.repo.GetByUserID(userID)
}

// GetAllCompanies fetches all companies
func (s *CompanyService) GetAllCompanies() ([]models.Company, error) {
	return s.repo.GetAll()
}
