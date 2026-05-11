package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/grawizah/backend/internal/handlers"
	"github.com/grawizah/backend/internal/middleware"
	"github.com/grawizah/backend/internal/services"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize services
	groqAPIKey := os.Getenv("GROQ_API_KEY")
	aiService := services.NewAIService(groqAPIKey)
	productService := services.NewProductService(nil) // TODO: Pass repository
	buyerService := services.NewBuyerService()
	inquiryService := services.NewInquiryService()
	rankingService := services.NewRankingService()
	leaderboardService := services.NewLeaderboardService()
	companyService := services.NewCompanyService()

	// Initialize handlers
	productHandler := handlers.NewProductHandler(productService, rankingService)
	buyerHandler := handlers.NewBuyerHandler(buyerService)
	aiHandler := handlers.NewAIHandler(aiService)
	inquiryHandler := handlers.NewInquiryHandler(inquiryService)
	chatHandler := handlers.NewChatHandler()
	authHandler := handlers.NewAuthHandler()
	leaderboardHandler := handlers.NewLeaderboardHandler(leaderboardService)
	companyHandler := handlers.NewCompanyHandler(companyService)

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		
		c.Next()
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "healthy",
			"service": "grawizah-api",
			"version": "1.0.0",
		})
	})

	// API routes
	api := r.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
		}

		// Product routes
		products := api.Group("/products")
		{
			products.GET("", productHandler.GetProducts)
			products.GET("/:id", productHandler.GetProductByID)
			products.POST("", productHandler.CreateProduct)
			products.PUT("/:id", productHandler.UpdateProduct)
			products.DELETE("/:id", productHandler.DeleteProduct)
			products.POST("/search", productHandler.SearchProducts)
			products.POST("/:id/view", productHandler.IncrementViewCount)
		}

		// Buyer routes
		buyers := api.Group("/buyers")
		{
			buyers.GET("/radar", buyerHandler.GetBuyerRadar)
			buyers.GET("/:id", buyerHandler.GetBuyerByID)
			buyers.POST("/search", buyerHandler.SearchBuyers)
			buyers.POST("/:id/lead-score", buyerHandler.GetLeadScore)
		}

		// Inquiry routes
		inquiries := api.Group("/inquiries")
		{
			inquiries.GET("/supplier/:id", inquiryHandler.GetInquiriesBySupplier)
			inquiries.GET("/buyer/:id", inquiryHandler.GetInquiriesByBuyer)
			inquiries.POST("", inquiryHandler.CreateInquiry)
			inquiries.PUT("/:id/respond", inquiryHandler.RespondToInquiry)
			inquiries.PUT("/:id/convert", inquiryHandler.MarkAsConverted)
			inquiries.GET("/analytics/:supplier_id", inquiryHandler.GetAnalytics)
		}

		// AI routes
		ai := api.Group("/ai")
		ai.Use(middleware.AIRateLimitMiddleware())
		{
			ai.POST("/hs-code", aiHandler.ClassifyHSCode)
			ai.POST("/response-suggestion", aiHandler.GetResponseSuggestion)
			ai.POST("/optimize-listing", aiHandler.OptimizeListing)
			ai.POST("/translate", aiHandler.TranslateText)
			ai.POST("/detect-language", aiHandler.DetectLanguage)
		}

		// Leaderboard routes
		api.GET("/leaderboard", leaderboardHandler.GetLeaderboard)
		api.GET("/leaderboard/company/:id", leaderboardHandler.GetCompanyRank)

		// Company routes
		api.GET("/companies/:id", companyHandler.GetCompanyByID)
		api.GET("/companies/me", companyHandler.GetMyCompany)

		// Chat & WhatsApp Bridge routes
		chat := api.Group("/chat")
		{
			chat.POST("/send", chatHandler.SendMessage)
			chat.GET("/history/:supplier_id", chatHandler.GetChatHistory)
		}

		whatsapp := api.Group("/whatsapp")
		{
			whatsapp.POST("/send", chatHandler.SendWhatsAppMessage)
			whatsapp.POST("/webhook", chatHandler.ReceiveWhatsAppWebhook)
		}

		// Competitor routes
		competitorService := services.NewCompetitorService()
		competitorHandler := handlers.NewCompetitorHandler(competitorService)
		api.GET("/competitor/benchmark", competitorHandler.GetBenchmark)

		// Buyer Quality routes
		buyerQualityService := services.NewBuyerQualityService()
		buyerQualityHandler := handlers.NewBuyerQualityHandler(buyerQualityService)
		api.GET("/buyers/:id/quality-score", buyerQualityHandler.GetQualityScore)

		// Market Alert routes
		marketAlertService := services.NewMarketAlertService()
		marketAlertHandler := handlers.NewMarketAlertHandler(marketAlertService)
		api.GET("/alerts/market", marketAlertHandler.GetAlerts)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Grawizah API Server starting on port %s", port)
	log.Printf("📚 API Documentation: http://localhost:%s/health", port)
	
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
