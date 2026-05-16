# Backend Dockerfile - Golang

FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/main.go

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates wget

# Create non-root user
RUN addgroup -S grawizah && adduser -S grawizah -G grawizah

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/main .

# Create uploads directory
RUN mkdir -p /app/uploads/documents && chown -R grawizah:grawizah /app

USER grawizah

EXPOSE 8080

CMD ["./main"]
