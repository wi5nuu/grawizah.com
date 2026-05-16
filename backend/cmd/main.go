package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/grawizah/backend/internal/db"
	"github.com/grawizah/backend/internal/handlers"
	"github.com/grawizah/backend/internal/middleware"
	"github.com/grawizah/backend/internal/repository"
	"github.com/grawizah/backend/internal/services"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Validate critical secrets in production
	if os.Getenv("GO_ENV") == "production" {
		if os.Getenv("JWT_SECRET") == "" || len(os.Getenv("JWT_SECRET")) < 32 {
			log.Fatal("❌ JWT_SECRET must be at least 32 characters in production")
		}
	}

	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("❌ Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Initialize repositories
	productRepo := repository.NewProductRepository(database)
	buyerRepo := repository.NewBuyerRepository(database)
	inquiryRepo := repository.NewInquiryRepository(database)
	leaderboardRepo := repository.NewLeaderboardRepository(database)
	chatRepo := repository.NewChatRepository(database)
	companyRepo := repository.NewCompanyRepository(database)
	documentRepo := repository.NewDocumentRepository(database)

	// Initialize services
	groqAPIKey := os.Getenv("GROQ_API_KEY")
	aiService := services.NewAIService(groqAPIKey)
	notificationService := services.NewNotificationService(database)
	productService := services.NewProductService(productRepo)
	buyerService := services.NewBuyerService(buyerRepo)
	inquiryService := services.NewInquiryService(inquiryRepo, notificationService)
	rankingService := services.NewRankingService()
	leaderboardService := services.NewLeaderboardService(leaderboardRepo)
	companyService := services.NewCompanyService(companyRepo)

	// Document service (AES-256 encryption key — must be 32 bytes)
	docEncryptionKey := os.Getenv("DOC_ENCRYPTION_KEY")
	if docEncryptionKey == "" {
		if os.Getenv("GO_ENV") == "production" {
			log.Fatal("❌ DOC_ENCRYPTION_KEY must be set in production")
		}
		log.Println("⚠️  WARNING: Using fallback DOC_ENCRYPTION_KEY — NOT safe for production")
		docEncryptionKey = "grawizah-doc-vault-32byte-key!!!"
	}
	docService, err := services.NewDocumentService(docEncryptionKey)
	if err != nil {
		log.Fatalf("❌ Failed to initialize document service: %v", err)
	}

	// Initialize handlers
	productHandler := handlers.NewProductHandler(productService, rankingService)
	buyerHandler := handlers.NewBuyerHandler(buyerService)
	aiHandler := handlers.NewAIHandler(aiService)
	inquiryHandler := handlers.NewInquiryHandler(inquiryService)
	chatHandler := handlers.NewChatHandler(chatRepo)
	authHandler := handlers.NewAuthHandler()
	leaderboardHandler := handlers.NewLeaderboardHandler(leaderboardService)
	companyHandler := handlers.NewCompanyHandler(companyService)
	logHandler := handlers.NewLogHandler()

	// Document handler
	uploadDir := os.Getenv("DOC_UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads/documents"
	}
	os.MkdirAll(uploadDir, 0755)
	documentHandler := handlers.NewDocumentHandler(documentRepo, docService, uploadDir)

	// Initialize Gin router
	r := gin.Default()

	// CORS middleware — dynamic origin checking
	allowedOrigins := os.Getenv("CORS_ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}
	origins := strings.Split(allowedOrigins, ",")
	for i := range origins {
		origins[i] = strings.TrimSpace(origins[i])
	}

	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		for _, o := range origins {
			if o == origin {
				c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
				c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
				break
			}
		}
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
	api.Use(middleware.RateLimitMiddleware(100, time.Minute))
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/login", authHandler.Login)
			auth.POST("/register", authHandler.Register)
			auth.POST("/upgrade-tier", authHandler.UpgradeTier)
		}

		// Log routes
		api.POST("/logs/error", logHandler.LogError)

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
			products.GET("/category/:category", productHandler.GetProductsByCategory)
			products.GET("/:id/optimize", productHandler.GetOptimizedListing)
		}

		// Buyer routes
		buyers := api.Group("/buyers")
		{
			buyers.GET("/radar", buyerHandler.GetBuyerRadar)
			buyers.GET("/:id", buyerHandler.GetBuyerByID)
			buyers.POST("/search", buyerHandler.SearchBuyers)
			buyers.POST("/:id/lead-score", buyerHandler.GetLeadScore)
			buyers.GET("/country/:country", buyerHandler.GetBuyersByCountry)
			buyers.GET("/top", buyerHandler.GetTopBuyers)
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
			inquiries.GET("/:id", inquiryHandler.GetInquiryByID)
			inquiries.POST("/:id/ai-suggest", inquiryHandler.AISuggestResponse)
			inquiries.PUT("/:id/rate", inquiryHandler.RateInquiry)
		}

		// AI routes (require auth + rate limiting)
		ai := api.Group("/ai")
		ai.Use(middleware.AuthMiddleware())
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
		api.GET("/leaderboard/top", leaderboardHandler.GetTopSuppliers)
		api.GET("/leaderboard/company/:id/breakdown", leaderboardHandler.GetCompanyBreakdown)
		api.PUT("/leaderboard/company/:id/hide", leaderboardHandler.HideCompany)
		api.PUT("/leaderboard/company/:id/show", leaderboardHandler.ShowCompany)

		// Company routes
		api.GET("/companies/:id", companyHandler.GetCompanyByID)
		api.GET("/companies/me", companyHandler.GetMyCompany)
		api.PUT("/companies/:id", companyHandler.UpdateCompany)
		api.GET("/companies/:id/products", companyHandler.GetCompanyProducts)
		api.GET("/companies/:id/stats", companyHandler.GetCompanyStats)
		api.POST("/companies/:id/certifications", companyHandler.AddCertification)
		api.DELETE("/companies/:id/certifications/:cert_id", companyHandler.RemoveCertification)
		api.PUT("/companies/:id/verify", companyHandler.VerifyCompany)

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

		// Document Vault routes
		documents := api.Group("/documents")
		{
			documents.POST("/upload", documentHandler.UploadDocument)
			documents.GET("", documentHandler.ListDocuments)
			documents.GET("/:id/download", documentHandler.DownloadDocument)
			documents.DELETE("/:id", documentHandler.DeleteDocument)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	go func() {
		log.Printf("🚀 Grawizah API Server starting on port %s", port)
		log.Printf("📚 Health check: http://localhost:%s/health", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exited gracefully")
}
