# Grawizah Platform - Development Commands

.PHONY: help install dev build test clean

help:
	@echo "Grawizah Platform - Available Commands"
	@echo "======================================"
	@echo "install     - Install all dependencies"
	@echo "dev         - Run development servers"
	@echo "build       - Build for production"
	@echo "test        - Run all tests"
	@echo "clean       - Clean build artifacts"
	@echo "db-migrate  - Run database migrations"
	@echo "docker-up   - Start Docker containers"

install:
	@echo "Installing frontend dependencies..."
	npm install
	@echo "Installing backend dependencies..."
	cd backend && go mod download

dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8080"
	npm run dev & cd backend && go run cmd/main.go

build:
	@echo "Building frontend..."
	npm run build
	@echo "Building backend..."
	cd backend && go build -o bin/grawizah-api cmd/main.go

test:
	@echo "Running frontend tests..."
	npm test
	@echo "Running backend tests..."
	cd backend && go test ./...

clean:
	@echo "Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules
	rm -rf backend/bin
	rm -rf dist

db-migrate:
	@echo "Running database migrations..."
	psql $(DATABASE_URL) -f database/schema.sql

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down
