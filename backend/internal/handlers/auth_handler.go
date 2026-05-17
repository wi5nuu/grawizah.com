package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	supabaseURL string
	supabaseKey string
	db          *sql.DB
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterRequest struct {
	Email       string `json:"email" binding:"required"`
	Password    string `json:"password" binding:"required"`
	Role        string `json:"role"`
	CompanyName string `json:"company_name"`
}

func NewAuthHandler(db *sql.DB) *AuthHandler {
	return &AuthHandler{
		supabaseURL: strings.TrimSpace(os.Getenv("NEXT_PUBLIC_SUPABASE_URL")),
		supabaseKey: strings.TrimSpace(os.Getenv("SUPABASE_SERVICE_ROLE_KEY")),
		db:          db,
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
		log.Printf("❌ Supabase Login connection error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to auth provider: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		log.Printf("❌ Supabase Auth Error: %s", string(body))
		var errResp map[string]interface{}
		json.Unmarshal(body, &errResp)
		// Map common Supabase error keys
		errMsg := "Authentication failed"
		if msg, ok := errResp["error_description"].(string); ok {
			errMsg = msg
		} else if msg, ok := errResp["msg"].(string); ok {
			errMsg = msg
		} else if msg, ok := errResp["error"].(string); ok {
			errMsg = msg
		}

		c.JSON(resp.StatusCode, gin.H{"error": errMsg})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	// Lazy self-healing profile sync upon successful login
	userObj, ok := supabaseResp["user"].(map[string]interface{})
	if ok && h.db != nil {
		userUUID, _ := userObj["id"].(string)
		email, _ := userObj["email"].(string)
		
		var role string
		var companyName string
		
		metaObj, okMeta := userObj["user_metadata"].(map[string]interface{})
		if okMeta {
			role, _ = metaObj["role"].(string)
			companyName, _ = metaObj["company_name"].(string)
		}
		
		if role == "" {
			role = "buyer"
		}
		
		if userUUID != "" {
			// 1. Ensure user is in users table
			_, err = h.db.Exec(`
				INSERT INTO users (id, email, role, created_at, updated_at)
				VALUES ($1, $2, $3, NOW(), NOW())
				ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = EXCLUDED.role
			`, userUUID, email, role)
			if err != nil {
				log.Printf("⚠️  Failed to auto-sync logged in user to public.users: %v", err)
			}
			
			// 2. Ensure buyer or company record exists
			if role == "buyer" {
				if companyName == "" {
					// Use email prefix as neutral company name — never hardcode a fake name
					atIdx := strings.Index(email, "@")
					if atIdx > 0 {
						companyName = email[:atIdx]
					} else {
						companyName = email
					}
				}
				_, err = h.db.Exec(`
					INSERT INTO buyers (id, company_name, country, buy_score, verified, created_at, updated_at)
					VALUES ($1, $2, 'Unknown', 50, false, NOW(), NOW())
					ON CONFLICT (id) DO UPDATE SET company_name = CASE WHEN buyers.company_name = '' OR buyers.company_name IS NULL THEN EXCLUDED.company_name ELSE buyers.company_name END
				`, userUUID, companyName)
				if err != nil {
					log.Printf("⚠️  Failed to auto-sync buyer profile: %v", err)
				}
			} else if role == "free_trader" || role == "premium_trader" {
				if companyName == "" {
					companyName = "Default Supplier Company"
				}
				_, err = h.db.Exec(`
					INSERT INTO companies (id, owner_id, name, country, verified, score, created_at, updated_at)
					VALUES ($1, $1, $2, 'Indonesia', true, 95, NOW(), NOW())
					ON CONFLICT (id) DO NOTHING
				`, userUUID, companyName)
				if err != nil {
					log.Printf("⚠️  Failed to auto-sync company profile: %v", err)
				}
			}
		}
	}

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

	// Call Supabase Admin API to create a CONFIRMED user
	payload, _ := json.Marshal(map[string]interface{}{
		"email":         req.Email,
		"password":      req.Password,
		"email_confirm": true, // AUTO-CONFIRM
		"user_metadata": map[string]string{
			"role":         req.Role,
			"company_name": req.CompanyName,
		},
	})

	client := &http.Client{}
	url := h.supabaseURL + "/auth/v1/admin/users"
	request, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	request.Header.Set("apikey", h.supabaseKey)
	request.Header.Set("Authorization", "Bearer "+h.supabaseKey) // Required for Admin API
	request.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(request)
	if err != nil {
		log.Printf("❌ Supabase Admin Register connection error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to connect to auth provider: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		log.Printf("❌ Supabase Admin Register Error: status=%d, body=%s", resp.StatusCode, string(body))
		var errResp map[string]interface{}
		json.Unmarshal(body, &errResp)
		errMsg := "Registration failed"
		if msg, ok := errResp["msg"].(string); ok {
			errMsg = msg
		} else if msg, ok := errResp["error"].(string); ok {
			errMsg = msg
		}
		c.JSON(resp.StatusCode, gin.H{"error": errMsg})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	// Auto-insert profile into database
	if userUUID, ok := supabaseResp["id"].(string); ok && userUUID != "" && h.db != nil {
		role := req.Role
		if role == "" {
			role = "buyer"
		}
		_, err = h.db.Exec(`
			INSERT INTO users (id, email, role, created_at, updated_at)
			VALUES ($1, $2, $3, NOW(), NOW())
			ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, role = EXCLUDED.role
		`, userUUID, req.Email, role)
		if err != nil {
			log.Printf("⚠️  Failed to insert registered user into public.users: %v", err)
		}

		if role == "buyer" {
			companyName := req.CompanyName
			if companyName == "" {
				// Use email prefix as neutral company name — never hardcode a fake name
				atIdx := strings.Index(req.Email, "@")
				if atIdx > 0 {
					companyName = req.Email[:atIdx]
				} else {
					companyName = req.Email
				}
			}
			_, err = h.db.Exec(`
				INSERT INTO buyers (id, company_name, country, buy_score, verified, created_at, updated_at)
				VALUES ($1, $2, 'Unknown', 50, false, NOW(), NOW())
				ON CONFLICT (id) DO UPDATE SET company_name = CASE WHEN buyers.company_name = '' OR buyers.company_name IS NULL THEN EXCLUDED.company_name ELSE buyers.company_name END
			`, userUUID, companyName)
			if err != nil {
				log.Printf("⚠️  Failed to insert registered buyer: %v", err)
			}
		} else if role == "free_trader" || role == "premium_trader" {
			companyName := req.CompanyName
			if companyName == "" {
				companyName = "Default Supplier Company"
			}
			_, err = h.db.Exec(`
				INSERT INTO companies (id, owner_id, name, country, verified, score, created_at, updated_at)
				VALUES ($1, $1, $2, 'Indonesia', true, 95, NOW(), NOW())
				ON CONFLICT (id) DO NOTHING
			`, userUUID, companyName)
			if err != nil {
				log.Printf("⚠️  Failed to insert registered company: %v", err)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
		"user":    supabaseResp,
	})
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// Refresh handles POST /api/auth/refresh
func (h *AuthHandler) Refresh(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Mock refresh for local development if Supabase is not configured
	if h.supabaseURL == "" || h.supabaseURL == "https://your-project.supabase.co" {
		c.JSON(http.StatusOK, gin.H{
			"token":         "mock-jwt-token-for-dev-only",
			"refresh_token": "mock-refresh-token",
		})
		return
	}

	// Call Supabase Auth API to refresh token
	payload, _ := json.Marshal(map[string]string{
		"refresh_token": req.RefreshToken,
	})

	client := &http.Client{}
	url := h.supabaseURL + "/auth/v1/token?grant_type=refresh_token"
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
		c.JSON(resp.StatusCode, gin.H{"error": "Failed to refresh token", "details": errResp})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	c.JSON(http.StatusOK, gin.H{
		"token":         supabaseResp["access_token"],
		"refresh_token": supabaseResp["refresh_token"],
	})
}
