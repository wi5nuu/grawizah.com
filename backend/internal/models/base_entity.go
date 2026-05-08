package models

import (
	"time"

	"github.com/google/uuid"
)

// BaseEntity implements common fields for all entities
// Implements Inheritance pattern in Go through struct embedding
type BaseEntity struct {
	ID        string     `json:"id" db:"id"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`
}

// NewBaseEntity creates a new base entity with generated UUID and timestamps
func NewBaseEntity() BaseEntity {
	now := time.Now()
	return BaseEntity{
		ID:        uuid.New().String(),
		CreatedAt: &now,
		UpdatedAt: &now,
	}
}

// UpdateTimestamp updates the updated_at timestamp
func (b *BaseEntity) UpdateTimestamp() {
	now := time.Now()
	b.UpdatedAt = &now
}

// IsDeleted checks if entity is soft-deleted
func (b *BaseEntity) IsDeleted() bool {
	return b.DeletedAt != nil
}

// SoftDelete marks entity as deleted
func (b *BaseEntity) SoftDelete() {
	now := time.Now()
	b.DeletedAt = &now
}
