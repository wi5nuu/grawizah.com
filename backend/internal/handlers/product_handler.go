package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/models"
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
	companyID := c.Query("company_id")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	var products []models.Product
	var err error

	if companyID != "" {
		products, err = h.productService.GetProductsByCompany(c.Request.Context(), companyID)
	} else {
		products, err = h.productService.GetProducts(c.Request.Context(), limit, offset)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	total := len(products)
	page := (offset / limit) + 1
	hasMore := total == limit // if we got a full page, there may be more

	c.JSON(http.StatusOK, gin.H{
		"data":    products,
		"total":   total,
		"page":    page,
		"limit":   limit,
		"hasMore": hasMore,
	})
}

// GetProductByID handles GET /api/products/:id
func (h *ProductHandler) GetProductByID(c *gin.Context) {
	id := c.Param("id")

	product, err := h.productService.GetProductByID(c.Request.Context(), id)
	if err != nil {
		if err == models.ErrNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, product)
}

// CreateProduct handles POST /api/products
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetString("user_id")
	if product.CompanyID == "" {
		product.CompanyID = userID
	} else if product.CompanyID != userID && userID != "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized to add products for this company"})
		return
	}

	if product.CompanyID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Company ID is required"})
		return
	}

	userRole, exists := c.Get("user_role")
	if exists && userRole == "free_trader" {
		products, err := h.productService.GetProductsByCompany(c.Request.Context(), product.CompanyID)
		if err == nil && len(products) >= 5 {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Premium subscription required",
				"message": "Free tier is limited to 5 products. Please upgrade to Premium.",
			})
			return
		}
	}

	if err := h.productService.CreateProduct(c.Request.Context(), &product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Product created successfully",
		"data":    product,
	})
}

// UpdateProduct handles PUT /api/products/:id
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.productService.UpdateProduct(c.Request.Context(), id, &product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product updated successfully",
		"id":      id,
	})
}

// DeleteProduct handles DELETE /api/products/:id
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	if err := h.productService.DeleteProduct(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Product deleted successfully",
		"id":      id,
	})
}

// SearchProducts handles POST /api/products/search
func (h *ProductHandler) SearchProducts(c *gin.Context) {
	var input struct {
		Query  string `json:"query"`
		Limit  int    `json:"limit"`
		Offset int    `json:"offset"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.Limit == 0 {
		input.Limit = 20
	}

	products, err := h.productService.SearchProducts(c.Request.Context(), input.Query, input.Limit, input.Offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GetProductsByCategory handles GET /api/products/category/:category
func (h *ProductHandler) GetProductsByCategory(c *gin.Context) {
	category := c.Param("category")
	products, err := h.productService.GetProductsByCategory(c.Request.Context(), category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// GetOptimizedListing handles GET /api/products/:id/optimize
func (h *ProductHandler) GetOptimizedListing(c *gin.Context) {
	id := c.Param("id")
	product, err := h.productService.GetProductByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, product)
}

// IncrementViewCount handles POST /api/products/:id/view
func (h *ProductHandler) IncrementViewCount(c *gin.Context) {
	id := c.Param("id")

	if err := h.productService.IncrementViewCount(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "View count incremented",
		"id":      id,
	})
}
