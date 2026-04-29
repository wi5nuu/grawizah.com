package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// RoleGuard checks if user has required role
func RoleGuard(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		// Role hierarchy
		roleHierarchy := map[string]int{
			"guest":          0,
			"free_trader":    1,
			"premium_trader": 2,
			"buyer":          2,
			"admin":          3,
		}

		userLevel := roleHierarchy[userRole.(string)]
		requiredLevel := roleHierarchy[requiredRole]

		if userLevel < requiredLevel {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Insufficient permissions",
				"required_role": requiredRole,
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// PremiumOnlyMiddleware restricts access to premium features
func PremiumOnlyMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authentication required"})
			c.Abort()
			return
		}

		if userRole != "premium_trader" && userRole != "admin" {
			c.JSON(http.StatusForbidden, gin.H{
				"error": "Premium subscription required",
				"message": "Upgrade to Premium Intelligence to access this feature",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
