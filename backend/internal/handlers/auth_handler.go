package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	supabaseURL string
	supabaseKey string
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

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{
		supabaseURL: os.Getenv("NEXT_PUBLIC_SUPABASE_URL"),
		supabaseKey: os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
	}
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock Login for local development if Supabase is not configured
	if h.supabaseURL == "" || h.supabaseURL == "https://your-project.supabase.co" {
		log.Println("🛠️  Auth: Using local mock login")
		role := "free_trader"
		if req.Email == "supplier_premium@test.com" {
			role = "premium_trader"
		} else if req.Email == "buyer@test.com" {
			role = "buyer"
		}

		c.JSON(http.StatusOK, gin.H{
			"token": "mock-jwt-token-for-dev-only",
			"user": gin.H{
				"id":    "00000000-0000-0000-0000-000000000000",
				"email": req.Email,
				"user_metadata": gin.H{
					"role":      role,
					"full_name": "Test User",
				},
			},
		})
		return
	}

	// Call Supabase Auth API
	payload, _ := json.Marshal(map[string]string{
		"email":    req.Email,
		"password": req.Password,
	})

	client := &http.Client{}
	url := h.supabaseURL + "/auth/v1/token?grant_type=password"
	request, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	request.Header.Set("apikey", h.supabaseKey)
	request.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to auth provider"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		var errResp map[string]interface{}
		json.Unmarshal(body, &errResp)
		errMsg := errResp["error_description"]
		if errMsg == nil {
			errMsg = errResp["msg"]
		}
		if errMsg == nil {
			errMsg = "Authentication failed"
		}
		c.JSON(resp.StatusCode, gin.H{"error": errMsg})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	c.JSON(http.StatusOK, gin.H{
		"token": supabaseResp["access_token"],
		"user":  supabaseResp["user"],
	})
}

// UpgradeTier handles POST /api/auth/upgrade-tier
func (h *AuthHandler) UpgradeTier(c *gin.Context) {
	var input struct {
		UserID string `json:"user_id" binding:"required"`
		Role   string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	validRoles := map[string]bool{"free_trader": true, "premium_trader": true, "buyer": true, "admin": true, "guest": true}
	if !validRoles[input.Role] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid role"})
		return
	}

	// Update user role via Supabase Admin API
	payload, _ := json.Marshal(map[string]interface{}{
		"user_metadata": map[string]string{
			"role": input.Role,
		},
	})

	url := h.supabaseURL + "/auth/v1/admin/users/" + input.UserID
	req, err := http.NewRequest("PUT", url, bytes.NewBuffer(payload))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to build request"})
		return
	}
	req.Header.Set("apikey", h.supabaseKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+h.supabaseKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to auth provider"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		c.JSON(resp.StatusCode, gin.H{"error": "Failed to update user role", "details": string(body)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Tier upgraded successfully",
		"user_id":  input.UserID,
		"new_role": input.Role,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Use Supabase Admin API to create user with email confirmed
	payload, _ := json.Marshal(map[string]interface{}{
		"email":         req.Email,
		"password":      req.Password,
		"email_confirm": true,
		"user_metadata": map[string]string{
			"role": req.Role,
		},
	})

	client := &http.Client{}
	url := h.supabaseURL + "/auth/v1/admin/users"
	request, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	request.Header.Set("apikey", h.supabaseKey)
	request.Header.Set("Authorization", "Bearer "+h.supabaseKey)
	request.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(request)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to auth provider"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		var errResp map[string]interface{}
		json.Unmarshal(body, &errResp)
		c.JSON(resp.StatusCode, gin.H{"error": errResp["msg"]})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
		"user":    supabaseResp,
	})
}
