package middleware_test

import (
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/grawizah/backend/internal/middleware"
)

// ─── helpers ──────────────────────────────────────────────────────────────────

const testSecret = "test-secret-key-at-least-32-chars!!"

// makeToken builds a signed HS256 JWT with the given claims and key.
func makeToken(t *testing.T, claims jwt.MapClaims, secret string) string {
	t.Helper()
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := tok.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("failed to sign token: %v", err)
	}
	return signed
}

// validClaims returns a minimal set of claims that will pass AuthMiddleware.
func validClaims(extraSecs int64) jwt.MapClaims {
	now := time.Now().Unix()
	return jwt.MapClaims{
		"sub":   "user-uuid-1234",
		"email": "test@grawizah.com",
		"iat":   now,
		"exp":   now + 3600 + extraSecs,
		"user_metadata": map[string]interface{}{
			"role": "free_trader",
		},
	}
}

// setupRouter creates a minimal Gin router that applies AuthMiddleware and
// returns 200 + the user_id claim if authentication succeeds.
func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/protected", middleware.AuthMiddleware(), func(c *gin.Context) {
		uid, _ := c.Get("user_id")
		c.JSON(http.StatusOK, gin.H{"user_id": uid})
	})
	return r
}

// request fires a GET /protected with an optional Authorization header.
func request(router *gin.Engine, authHeader string) *httptest.ResponseRecorder {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest(http.MethodGet, "/protected", nil)
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}
	router.ServeHTTP(w, req)
	return w
}

// ─── tests ────────────────────────────────────────────────────────────────────

// TC-01: A valid HS256 token must be accepted and claims extracted.
func TestAuthMiddleware_ValidHMACToken(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	os.Setenv("GO_ENV", "development")
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	token := makeToken(t, validClaims(0), testSecret)
	w := request(setupRouter(), "Bearer "+token)

	if w.Code != http.StatusOK {
		t.Errorf("TC-01: expected 200, got %d — body: %s", w.Code, w.Body.String())
	}
}

// TC-02: An expired token must return 401.
func TestAuthMiddleware_ExpiredToken(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	claims := jwt.MapClaims{
		"sub": "user-uuid-1234",
		"iat": time.Now().Add(-2 * time.Hour).Unix(),
		"exp": time.Now().Add(-1 * time.Hour).Unix(), // already expired
	}
	token := makeToken(t, claims, testSecret)
	w := request(setupRouter(), "Bearer "+token)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-02: expected 401 for expired token, got %d", w.Code)
	}
}

// TC-03: A token signed with a wrong key must return 401.
func TestAuthMiddleware_WrongSignature(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	// Sign with a DIFFERENT secret — server should reject it.
	token := makeToken(t, validClaims(0), "completely-wrong-secret-key-32ch")
	w := request(setupRouter(), "Bearer "+token)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-03: expected 401 for bad signature, got %d", w.Code)
	}
}

// TC-04: A request with no Authorization header must return 401.
func TestAuthMiddleware_MissingHeader(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	w := request(setupRouter(), "") // no header

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-04: expected 401 for missing header, got %d", w.Code)
	}
}

// TC-05: Mock token must return 401 when GO_ENV=production.
func TestAuthMiddleware_MockToken_BlockedInProduction(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	os.Setenv("GO_ENV", "production") // production gate active
	defer func() {
		os.Unsetenv("SUPABASE_JWT_SECRET")
		os.Setenv("GO_ENV", "development")
	}()

	w := request(setupRouter(), "Bearer mock-jwt-token-for-dev-only")

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-05: expected 401 for mock token in production, got %d", w.Code)
	}
}

// TC-06: Mock token must pass when GO_ENV is NOT production (development mode).
func TestAuthMiddleware_MockToken_AllowedInDevelopment(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	os.Setenv("GO_ENV", "development")
	defer func() {
		os.Unsetenv("SUPABASE_JWT_SECRET")
		os.Unsetenv("GO_ENV")
	}()

	w := request(setupRouter(), "Bearer mock-jwt-token-for-dev-only")

	if w.Code != http.StatusOK {
		t.Errorf("TC-06: expected 200 for mock token in development, got %d", w.Code)
	}
}

// TC-07: A completely garbage token string must return 401.
func TestAuthMiddleware_GarbageToken(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	w := request(setupRouter(), "Bearer not.a.jwt")

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-07: expected 401 for garbage token, got %d", w.Code)
	}
}

// TC-08: A token with algorithm=none (alg bypass attack) must return 401.
func TestAuthMiddleware_AlgNoneAttack(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	// Manually craft a "none" alg token (no signature)
	header := "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0"             // {"alg":"none","typ":"JWT"}
	payload := "eyJzdWIiOiJhZG1pbiIsImV4cCI6OTk5OTk5OTk5OX0"   // {"sub":"admin","exp":9999999999}
	noneToken := header + "." + payload + "."

	w := request(setupRouter(), "Bearer "+noneToken)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("TC-08: expected 401 for alg=none attack, got %d", w.Code)
	}
}

// TC-09: Malformed Authorization header format must return 401.
func TestAuthMiddleware_MalformedAuthHeader(t *testing.T) {
	os.Setenv("SUPABASE_JWT_SECRET", testSecret)
	defer os.Unsetenv("SUPABASE_JWT_SECRET")

	testCases := []struct {
		name   string
		header string
	}{
		{"no-bearer-prefix", "Token sometoken"},
		{"only-bearer", "Bearer"},
		{"empty-value", ""},
	}

	router := setupRouter()
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			w := request(router, tc.header)
			if w.Code != http.StatusUnauthorized {
				t.Errorf("TC-09 [%s]: expected 401, got %d", tc.name, w.Code)
			}
		})
	}
}
