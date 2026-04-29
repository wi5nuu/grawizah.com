# 🚀 GRAWIZAH - Complete Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Go** 1.21 or higher
- **PostgreSQL** 14+ (or Supabase account)
- **Redis** (or Upstash account)
- **Git**

---

## 📦 Step 1: Clone Repository

```bash
git clone https://github.com/wi5nuu/grawizah.com.git
cd grawizah.com
```

---

## 🔧 Step 2: Frontend Setup

### Install Dependencies

```bash
npm install
# or
yarn install
```

### Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=gsk_your_api_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Redis/Upstash
UPSTASH_REDIS_URL=https://your-redis.upstash.io
UPSTASH_REDIS_TOKEN=your_token

# WhatsApp (Optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# JWT Secrets
JWT_SECRET=your_32_character_secret
ENCRYPTION_KEY=your_32_character_key
```

### Get API Keys

#### Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy `URL` and `anon public` key

#### Groq AI
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/Login
3. Go to API Keys
4. Create new API key

#### Upstash Redis
1. Go to [console.upstash.com](https://console.upstash.com)
2. Create new Redis database
3. Copy REST URL and Token

#### Twilio WhatsApp (Optional)
1. Go to [twilio.com/console](https://www.twilio.com/console)
2. Get WhatsApp sandbox credentials
3. Configure webhook URL

---

## 🗄️ Step 3: Database Setup

### Option A: Using Supabase (Recommended)

1. In your Supabase project, go to SQL Editor
2. Copy content from `database/schema.sql`
3. Run the SQL script
4. Verify tables are created

### Option B: Local PostgreSQL

```bash
# Create database
createdb grawizah

# Run migration
psql -d grawizah -f database/schema.sql
```

---

## 🔙 Step 4: Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Install Go Dependencies

```bash
go mod download
go mod tidy
```

### Configure Backend Environment

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=8080
DATABASE_URL=postgresql://postgres:password@localhost:5432/grawizah
GROQ_API_KEY=your_groq_key
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
```

### Build Backend

```bash
go build -o bin/grawizah ./cmd/main.go
```

---

## 🚀 Step 5: Run the Application

### Terminal 1: Start Backend

```bash
cd backend
go run cmd/main.go
```

Backend will run on `http://localhost:8080`

### Terminal 2: Start Frontend

```bash
npm run dev
# or
yarn dev
```

Frontend will run on `http://localhost:3000`

---

## ✅ Step 6: Verify Installation

### Check Backend Health

```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "grawizah-api",
  "version": "1.0.0"
}
```

### Check Frontend

Open browser: `http://localhost:3000`

You should see the Grawizah landing page.

---

## 🧪 Step 7: Test Features

### Test AI HS Code Classifier

```bash
curl -X POST http://localhost:8080/api/ai/hs-code \
  -H "Content-Type: application/json" \
  -d '{"description": "Crude Palm Oil", "category": "Agriculture"}'
```

### Test User Registration

1. Go to `http://localhost:3000/register`
2. Fill in the form
3. Check Supabase Auth dashboard

---

## 🔐 Step 8: Security Setup

### Generate Secrets

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Encryption Key
openssl rand -hex 32
```

Add these to your `.env.local` and `backend/.env`

### Enable 2FA (Optional)

Update `.env.local`:
```env
ENABLE_2FA=true
```

---

## 📊 Step 9: Optional Services

### Google Analytics

1. Create GA4 property
2. Get Measurement ID
3. Add to `.env.local`:
```env
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Sentry Error Tracking

1. Create Sentry project
2. Get DSN
3. Add to `.env.local`:
```env
SENTRY_DSN=your_sentry_dsn
```

---

## 🐳 Step 10: Docker Setup (Optional)

### Build Docker Images

```bash
# Frontend
docker build -f Dockerfile.frontend -t grawizah-frontend .

# Backend
cd backend
docker build -t grawizah-backend .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Check firewall settings

### Issue: "Groq API error"

**Solution:**
- Verify GROQ_API_KEY is valid
- Check API quota/limits
- Ensure internet connection

### Issue: "Module not found"

**Solution:**
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
go mod tidy
go mod download
```

### Issue: "Port already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

---

## 📝 Development Tips

### Hot Reload

Frontend automatically reloads on file changes.

For backend hot reload, use:
```bash
go install github.com/cosmtrek/air@latest
cd backend
air
```

### Database Migrations

When updating schema:
1. Edit `database/schema.sql`
2. Run migration in Supabase SQL Editor
3. Or: `psql -d grawizah -f database/schema.sql`

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend
go test ./...
```

---

## 🚀 Production Deployment

### Frontend (Vercel)

```bash
vercel --prod
```

### Backend (Railway/Fly.io)

```bash
# Railway
railway up

# Fly.io
fly deploy
```

### Environment Variables

Set all production environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Railway: Project → Variables
- Fly.io: `fly secrets set KEY=value`

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Go Documentation](https://go.dev/doc/)

---

## 🆘 Support

If you encounter issues:

1. Check this guide thoroughly
2. Review error logs
3. Check GitHub Issues
4. Contact: support@grawizah.com

---

**Grawizah Intelligence Hub - 2026**

*Secure, Fast, & Intelligent Global Trade*
