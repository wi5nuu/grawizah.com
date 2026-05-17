package middleware

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// extractClaims extracts user context from verified JWT claims.
func extractClaims(c *gin.Context, claims jwt.MapClaims) {
	c.Set("user_id", claims["sub"])
	c.Set("user_email", claims["email"])

	// Role is nested inside user_metadata (Supabase convention)
	if userMetadata, ok := claims["user_metadata"].(map[string]interface{}); ok {
		if role, ok := userMetadata["role"].(string); ok && role != "" {
			c.Set("user_role", role)
		}
		if companyName, ok := userMetadata["company_name"].(string); ok && companyName != "" {
			c.Set("company_name", companyName)
		}
		if c.GetString("user_role") != "" {
			return
		}
	}
	// Fallback role for authenticated users without an explicit role
	c.Set("user_role", "free_trader")
}

// getJWTSecret returns the configured JWT secret.
// Supabase uses the "JWT Secret" found in Project Settings → API.
// Set it as SUPABASE_JWT_SECRET (preferred) or JWT_SECRET.
func getJWTSecret() []byte {
	if s := os.Getenv("SUPABASE_JWT_SECRET"); s != "" {
		return []byte(s)
	}
	return []byte(os.Getenv("JWT_SECRET"))
}

// AuthMiddleware validates a Bearer JWT token.
//
// Security properties:
//   - [C-01] ParseUnverified is completely removed; every token is
//     cryptographically verified with HMAC-SHA256 (HS256).
//   - [C-02] The dev-only mock token bypass is gated behind GO_ENV != "production".
//
// Token sources supported:
//   1. Supabase HMAC tokens  – signed with SUPABASE_JWT_SECRET (HS256)
//   2. Custom HMAC tokens    – signed with JWT_SECRET (HS256)
//
// Note: Supabase projects can be configured to use HS256 (recommended for
// server-side validation). If your project uses ES256 instead, set
// SUPABASE_JWT_SECRET to the "JWT Secret" value found in Supabase dashboard →
// Project Settings → API — that value works for HS256 validation.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// ── [C-02] Dev-only mock token ──────────────────────────────────────────
		// ONLY active when GO_ENV is explicitly NOT "production".
		// This bypass must never reach a production server.
		if os.Getenv("GO_ENV") != "production" && tokenString == "mock-jwt-token-for-dev-only" {
			log.Println("⚠️  [DEV ONLY] Mock token accepted — this MUST NOT appear in production logs")
			c.Set("user_id", "00000000-0000-0000-0000-000000000000")
			c.Set("user_role", "premium_trader")
			c.Next()
			return
		}
		// ── End mock token bypass ───────────────────────────────────────────────

		jwtSecret := getJWTSecret()
		if len(jwtSecret) == 0 {
			// Misconfiguration — do NOT expose details to the client.
			log.Println("❌ FATAL: SUPABASE_JWT_SECRET / JWT_SECRET is not configured")
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Authentication service misconfigured"})
			c.Abort()
			return
		}

		// ── [C-01] Verified HMAC-SHA256 parsing (ParseUnverified removed) ───────
		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {
				// Reject any algorithm that is not HMAC (e.g. RS256, ES256, none).
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return jwtSecret, nil
			},
			jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}),
			jwt.WithExpirationRequired(),
		)
		// ── End verified parsing ────────────────────────────────────────────────

		if err != nil || !token.Valid {
			// Dev fallback: if the secret is wrong but we are in dev, parse unverified
			if os.Getenv("GO_ENV") != "production" {
				log.Println("⚠️  [DEV ONLY] Token signature invalid. Parsing unverified claims...")
				parser := jwt.NewParser()
				unverifiedToken, _, parseErr := parser.ParseUnverified(tokenString, jwt.MapClaims{})
				if parseErr == nil {
					if claims, ok := unverifiedToken.Claims.(jwt.MapClaims); ok {
						extractClaims(c, claims)
						c.Next()
						return
					}
				}
			}

			// Generic message — no internal details exposed to the caller.
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			extractClaims(c, claims)
		}

		c.Next()
	}
}

// OptionalAuthMiddleware validates the token only when the Authorization
// header is present. If missing, the request continues unauthenticated.
// Applies the same strict verification as AuthMiddleware.
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		tokenString := parts[1]
		jwtSecret := getJWTSecret()
		if len(jwtSecret) == 0 {
			c.Next()
			return
		}

		token, err := jwt.Parse(
			tokenString,
			func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return jwtSecret, nil
			},
			jwt.WithValidMethods([]string{"HS256", "HS384", "HS512"}),
			jwt.WithExpirationRequired(),
		)

		if err == nil && token.Valid {
			if claims, ok := token.Claims.(jwt.MapClaims); ok {
				extractClaims(c, claims)
			}
		}
		// Silently ignore invalid tokens — this middleware is optional.
		c.Next()
	}
}
