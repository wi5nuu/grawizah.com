# ==========================================
# STAGE 1: Build Backend
# ==========================================
FROM golang:1.21-alpine AS builder

# Set necessary environment variables needed for our image
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /build

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy application source code
COPY . .

# Build the binary with optimizations (strip debug symbols)
RUN go build -ldflags="-s -w" -o grawizah-api ./cmd/main.go

# ==========================================
# STAGE 2: Minimal Runtime Image
# ==========================================
FROM alpine:3.19

# Install CA certificates for external HTTPS calls (Supabase, Groq)
RUN apk --no-cache add ca-certificates tzdata

# Create non-root user for security
RUN adduser -D -g '' grawizah

WORKDIR /app

# Copy binary from builder
COPY --from=builder /build/grawizah-api .

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads/documents && \
    chown -R grawizah:grawizah /app

# Use the non-root user
USER grawizah

EXPOSE 8080

# Command to run the executable
CMD ["./grawizah-api"]
