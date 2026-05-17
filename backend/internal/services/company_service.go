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
func (s *CompanyService) CreateCompany(company *models.Company) error {
	return s.repo.Create(company)
}

func (s *CompanyService) GetCompanyByID(id string) (*models.Company, error) {
	return s.repo.GetByID(id)
}

// GetMyCompany fetches the company details for the currently authenticated user
func (s *CompanyService) GetMyCompany(userID string) (*models.Company, error) {
	company, err := s.repo.GetByUserID(userID)
	if err != nil {
		// Auto-create company to support SSO and registration flow robustness
		newComp := models.NewCompany(userID, "Default Supplier Company", "Indonesia")
		newComp.ID = userID
		newComp.Score = 95
		newComp.Verified = true
		
		err = s.repo.Create(newComp)
		if err != nil {
			return nil, err
		}
		return newComp, nil
	}
	return company, nil
}

// GetAllCompanies fetches all companies
func (s *CompanyService) GetAllCompanies() ([]models.Company, error) {
	return s.repo.GetAll()
}

// UpdateCompany updates the details of a company
func (s *CompanyService) UpdateCompany(id string, name string, country string, industry string, certs []string, logoURL string) error {
	company, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	company.Name = name
	company.Country = country
	company.BusinessType = industry
	company.Certifications = certs
	if logoURL != "" {
		company.LogoURL = logoURL
	}
	return s.repo.Update(company)
}

