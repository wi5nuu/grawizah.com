package models

import "errors"

var (
	ErrInvalidPriceRange = errors.New("minimum price cannot be greater than maximum price")
	ErrNotFound          = errors.New("entity not found")
	ErrUnauthorized      = errors.New("unauthorized access")
	ErrInvalidInput      = errors.New("invalid input data")
)
