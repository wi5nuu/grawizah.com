package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct{}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock authentication logic
	// In a real application, you would verify against a database and generate a JWT
	if req.Email == "test@grawizah.com" && req.Password == "password123" {
		c.JSON(http.StatusOK, gin.H{
			"token": "mock-jwt-token-12345",
			"user": gin.H{
				"id":    "user-1",
				"email": req.Email,
				"role":  "premium_trader",
			},
		})
		return
	}

	// Default fallback for any other login (useful for local testing)
	c.JSON(http.StatusOK, gin.H{
		"token": "mock-jwt-token-default",
		"user": gin.H{
			"id":    "user-default",
			"email": req.Email,
			"role":  "premium_trader",
		},
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role := req.Role
	if role == "" {
		role = "free_trader"
	}

	c.JSON(http.StatusOK, gin.H{
		"token": "mock-jwt-token-new",
		"user": gin.H{
			"id":    "user-new",
			"email": req.Email,
			"role":  role,
		},
	})
}
