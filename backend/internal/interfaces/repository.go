package interfaces

import (
	"github.com/grawizah/backend/internal/models"
)

// ProductRepository extends base repository with product-specific methods
type ProductRepository interface {
	GetByID(id string) (*models.Product, error)
	GetAll(limit, offset int) ([]models.Product, error)
	Create(product *models.Product) error
	Update(product *models.Product) error
	Delete(id string) error
	GetByCompanyID(companyID string) ([]models.Product, error)
	Search(query string, limit, offset int) ([]models.Product, error)
	IncrementViewCount(id string) error
	IncrementInquiryCount(id string) error
}

// BuyerRepository defines methods for buyer data
type BuyerRepository interface {
	GetAll(limit, offset int) ([]models.Buyer, error)
	GetByID(id string) (*models.Buyer, error)
	Search(criteria models.BuyerSearchCriteria) ([]models.Buyer, error)
}

// InquiryRepository defines methods for inquiry data
type InquiryRepository interface {
	GetBySupplierID(supplierID string) ([]models.InquiryDetail, error)
	GetByBuyerID(buyerID string) ([]models.Inquiry, error)
	Create(inquiry *models.Inquiry) error
	Update(inquiry *models.Inquiry) error
	GetByID(id string) (*models.Inquiry, error)
	GetAnalytics(supplierID string) (*models.InquiryAnalytics, error)
}

// LeaderboardRepository defines methods for leaderboard data
type LeaderboardRepository interface {
	GetAll(limit, offset int) ([]models.LeaderboardScore, error)
	GetByCompanyID(companyID string) (*models.LeaderboardScore, error)
}
