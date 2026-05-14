package handlers

import (
	"bytes"
	"encoding/json"
	"io"
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
		c.JSON(resp.StatusCode, gin.H{"error": errResp["error_description"]})
		return
	}

	var supabaseResp map[string]interface{}
	json.Unmarshal(body, &supabaseResp)

	c.JSON(http.StatusOK, gin.H{
		"token": supabaseResp["access_token"],
		"user":  supabaseResp["user"],
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Call Supabase Auth API
	payload, _ := json.Marshal(map[string]interface{}{
		"email":    req.Email,
		"password": req.Password,
		"data": map[string]string{
			"role": req.Role,
		},
	})

	client := &http.Client{}
	url := h.supabaseURL + "/auth/v1/signup"
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
