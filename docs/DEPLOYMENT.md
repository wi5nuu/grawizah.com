# Deployment Guide - Grawizah Platform

## Prerequisites

- Node.js 18+ (Frontend)
- Go 1.21+ (Backend)
- PostgreSQL 15+ (Supabase)
- Redis (Upstash)
- Groq API Key

## Environment Setup

### Frontend (.env)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=https://api.grawizah.com
GROQ_API_KEY=your_groq_key
```

### Backend (.env)
```bash
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
GROQ_API_KEY=your_groq_key
UPSTASH_REDIS_URL=your_redis_url
UN_COMTRADE_API_KEY=your_comtrade_key
JWT_SECRET=your_jwt_secret
```

## Frontend Deployment (Vercel)

```bash
# Install dependencies
npm install

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

## Backend Deployment (Docker)

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main ./cmd/main.go

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/main .
EXPOSE 8080
CMD ["./main"]
```

```bash
# Build and run
docker build -t grawizah-api .
docker run -p 8080:8080 --env-file .env grawizah-api
```

## Database Setup (Supabase)

1. Create new Supabase project
2. Run schema migration:
```bash
psql -h db.xxx.supabase.co -U postgres -d postgres -f database/schema.sql
```

3. Enable RLS policies in Supabase dashboard
4. Configure Auth providers (Google, GitHub, Facebook)

## Redis Setup (Upstash)

1. Create Upstash Redis instance
2. Copy connection URL and token
3. Add to environment variables

## Monitoring

- **Frontend**: Vercel Analytics
- **Backend**: Prometheus + Grafana
- **Database**: Supabase Dashboard
- **Logs**: CloudWatch / Datadog

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
      - run: docker push grawizah/api:latest
```

## Security Checklist

- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Enable database encryption at rest
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts
- [ ] Enable audit logging
