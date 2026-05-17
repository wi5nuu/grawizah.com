package services

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/grawizah/backend/internal/interfaces"
	"github.com/grawizah/backend/internal/models"
)

type ProductService struct {
	productRepo interfaces.ProductRepository
}

func NewProductService(productRepo interfaces.ProductRepository) *ProductService {
	return &ProductService{
		productRepo: productRepo,
	}
}

func (s *ProductService) GetProducts(ctx context.Context, limit, offset int) ([]models.Product, error) {
	return s.productRepo.GetAll(limit, offset)
}

func (s *ProductService) GetProductByID(ctx context.Context, id string) (*models.Product, error) {
	return s.productRepo.GetByID(id)
}

func (s *ProductService) CreateProduct(ctx context.Context, product *models.Product) error {
	if product.ID == "" {
		product.ID = uuid.New().String()
	}
	now := time.Now()
	product.CreatedAt = &now
	product.UpdatedAt = &now

	// Calculate listing score before saving
	product.CalculateListingScore()
	return s.productRepo.Create(product)
}

func (s *ProductService) UpdateProduct(ctx context.Context, id string, product *models.Product) error {
	product.ID = id
	// Recalculate listing score
	product.CalculateListingScore()
	return s.productRepo.Update(product)
}

func (s *ProductService) DeleteProduct(ctx context.Context, id string) error {
	return s.productRepo.Delete(id)
}

func (s *ProductService) SearchProducts(ctx context.Context, query string, limit, offset int) ([]models.Product, error) {
	return s.productRepo.Search(query, limit, offset)
}

func (s *ProductService) IncrementViewCount(ctx context.Context, productID string) error {
	return s.productRepo.IncrementViewCount(productID)
}

func (s *ProductService) GetProductsByCategory(ctx context.Context, category string) ([]models.Product, error) {
	return s.productRepo.GetByCategory(category)
}

func (s *ProductService) GetProductsByCompany(ctx context.Context, companyID string) ([]models.Product, error) {
	return s.productRepo.GetByCompanyID(companyID)
}
