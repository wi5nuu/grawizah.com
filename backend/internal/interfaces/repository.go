package interfaces

import "context"

// Repository interface - implements Abstraction
// Generic repository pattern for all entities
type Repository[T any] interface {
	FindByID(ctx context.Context, id string) (*T, error)
	FindAll(ctx context.Context, limit, offset int) ([]*T, error)
	Create(ctx context.Context, entity *T) error
	Update(ctx context.Context, id string, entity *T) error
	Delete(ctx context.Context, id string) error
}

// ProductRepository extends base repository with product-specific methods
type ProductRepository interface {
	Repository[any]
	FindByCategory(ctx context.Context, category string) ([]*any, error)
	FindByCompany(ctx context.Context, companyID string) ([]*any, error)
	SearchProducts(ctx context.Context, query string, filters map[string]interface{}) ([]*any, error)
}
