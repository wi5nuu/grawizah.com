package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// Connect initializes the database connection.
// [M-05] SSL mode is now configurable via DB_SSL_MODE env var.
// Defaults to "disable" for local development.
// Set DB_SSL_MODE=require in .env.production.
func Connect() (*sql.DB, error) {
	dbURL := os.Getenv("DATABASE_URL")

	if dbURL == "" {
		// Build connection string from individual components
		host := os.Getenv("DB_HOST")
		if host == "" {
			host = "localhost"
		}
		port := os.Getenv("DB_PORT")
		if port == "" {
			port = "5432"
		}
		user := os.Getenv("DB_USER")
		if user == "" {
			user = "postgres"
		}
		password := os.Getenv("DB_PASSWORD")
		dbname := os.Getenv("DB_NAME")
		if dbname == "" {
			dbname = "grawizah"
		}

		// [M-05] Read SSL mode from environment — never hardcode
		sslMode := os.Getenv("DB_SSL_MODE")
		if sslMode == "" {
			sslMode = "disable" // safe default for local dev
		}

		dbURL = fmt.Sprintf(
			"postgresql://%s:%s@%s:%s/%s?sslmode=%s",
			user, password, host, port, dbname, sslMode,
		)
	}

	// [M-05] Production safety check
	goEnv := os.Getenv("GO_ENV")
	sslMode := os.Getenv("DB_SSL_MODE")
	if goEnv == "production" && (sslMode == "disable" || sslMode == "") {
		log.Println("⚠️  WARNING: GO_ENV=production but DB_SSL_MODE=disable — database traffic is NOT encrypted!")
		log.Println("   Set DB_SSL_MODE=require (or verify-full) in your production environment.")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}

	// Connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetConnMaxIdleTime(1 * time.Minute)

	// Verify connection
	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("✅ Database connected successfully")

	// Dynamic Self-Healing Schema Migrations on Startup
	log.Println("🛠️  Running dynamic schema self-healing checks...")
	
	// 1. Ensure documents table has the correct columns (file_size and mime_type)
	_, err = db.Exec(`
		ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
		ALTER TABLE documents ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
	`)
	if err != nil {
		log.Printf("⚠️  Non-blocking schema check warning (documents): %v", err)
	} else {
		log.Println("📂 Documents table schema verified/patched successfully")
	}

	// 2. Ensure chat_messages has ON DELETE CASCADE if it exists, or just verify the schema
	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS chat_messages (
			id UUID PRIMARY KEY,
			supplier_id UUID,
			buyer_id UUID,
			product_id UUID,
			sender_id UUID NOT NULL,
			message TEXT NOT NULL,
			channel VARCHAR(50) DEFAULT 'chat',
			is_read BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT NOW()
		);
	`)
	if err != nil {
		log.Printf("⚠️  Non-blocking schema check warning (chat_messages): %v", err)
	}

	return db, nil
}
