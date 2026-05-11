package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/services"
)

type ProductHandler struct {
	productService *services.ProductService
	rankingService *services.RankingService
}

func NewProductHandler(productService *services.ProductService, rankingService *services.RankingService) *ProductHandler {
	return &ProductHandler{
		productService: productService,
		rankingService: rankingService,
	}
}

// GetProducts handles GET /api/products
func (h *ProductHandler) GetProducts(c *gin.Context) {
	sortType := c.Query("sort")
	
	// Mock products
	products := []map[string]interface{}{
		{"id": "p1", "name": "Industrial Valves X-200", "supplier": "TechCorp", "price": 250.0},
		{"id": "p2", "name": "Zinc Die Casting Parts", "supplier": "Nexus Robotics", "price": 45.0},
		{"id": "p3", "name": "Organic Coconut Oil", "supplier": "GreenEarth", "price": 12.5},
		{"id": "p4", "name": "Solar Panel Mono 450W", "supplier": "EcoEnergy", "price": 180.0},
	}

	if sortType == "ai" {
		products = h.rankingService.RankSuppliers(products, "")
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  products,
		"total": len(products),
		"page":  1,
		"limit": 20,
	})
}

// GetProductByID handles GET /api/products/:id
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	id := c.Param("id")

	// TODO: Call service to get product
	c.JSON(http.StatusOK, gin.H{
		"id":   id,
		"name": "Sample Product",
	})
}

// CreateProduct handles POST /api/products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var input map[string]interface{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service to create product
	c.JSON(http.StatusCreated, gin.H{
		"message": "Product created successfully",
		"data":    input,
	})
}

// UpdateProduct handles PUT /api/products/:id
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var input map[string]interface{}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service to update product
	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"id":      id,
	})
}

// DeleteProduct handles DELETE /api/products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	// TODO: Call service to delete product
	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
		"id":      id,
	})
}

// SearchProducts handles POST /api/products/search
func (h *ProductHandler) SearchProducts(c *gin.Context) {
	var input struct {
		Query   string                 `json:"query"`
		Filters map[string]interface{} `json:"filters"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Call service to search products
	c.JSON(http.StatusOK, []interface{}{})
}

// IncrementViewCount handles POST /api/products/:id/view
func (h *ProductHandler) IncrementViewCount(c *gin.Context) {
	id := c.Param("id")

	// TODO: Call service to increment view count
	c.JSON(http.StatusOK, gin.H{
		"message": "View count incremented",
		"id":      id,
	})
}
