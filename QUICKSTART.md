# Grawizah - Quick Start Guide

Get Grawizah up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Go 1.21+ installed (optional, for backend development)
- Supabase account (free tier works)
- Groq API key (free tier available)

## Step 1: Clone & Install

```bash
# Clone repository
git clone https://github.com/grawizah/platform.git
cd platform

# Install frontend dependencies
npm install

# Install backend dependencies (optional)
cd backend && go mod download && cd ..
```

## Step 2: Environment Setup

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:

```bash
# Supabase (Get from: https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_key_here

# Groq AI (Get from: https://console.groq.com)
GROQ_API_KEY=your_groq_api_key_here

# Backend API (default for local development)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Step 3: Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Create new project
3. Go to SQL Editor
4. Copy content from `database/schema.sql`
5. Paste and run

### Option B: Using CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push
```

## Step 4: Run Development Server

### Frontend Only (Quick Start)

```bash
npm run dev
```

Open http://localhost:3000

### Full Stack (Frontend + Backend)

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
cd backend
go run cmd/main.go
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Health Check: http://localhost:8080/health

## Step 5: Verify Installation

### Check Frontend
1. Open http://localhost:3000
2. You should see the landing page with purple/blue theme
3. Click "Browse Catalog" - should load (empty for now)

### Check Backend (if running)
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "grawizah-api"
}
```

### Check Database
1. Go to Supabase Dashboard → Table Editor
2. Verify tables exist: users, companies, products, buyers, inquiries
3. Go to Database → Functions
4. Verify functions exist: calculate_leaderboard_score, get_buy_score

## Step 6: Test AI Features

### Test HS Code Classifier

```bash
curl -X POST http://localhost:8080/api/ai/hs-code \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Fresh coconut oil, virgin, organic",
    "category": "Agriculture"
  }'
```

## Common Issues & Solutions

### Issue: "Module not found" error

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase connection error

- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check if Supabase project is active
- Verify network connection

### Issue: Groq API error

- Verify GROQ_API_KEY in .env
- Check API quota at https://console.groq.com
- Ensure API key has correct permissions

### Issue: Port already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 8080
npx kill-port 8080
```

## Next Steps

### 1. Create Test Data

```sql
-- In Supabase SQL Editor
INSERT INTO users (email, role) VALUES 
  ('trader@example.com', 'free_trader'),
  ('buyer@example.com', 'buyer');

INSERT INTO companies (owner_id, name, country, verified) VALUES 
  ((SELECT id FROM users WHERE email = 'trader@example.com'), 
   'PT Export Indonesia', 'Indonesia', true);
```

### 2. Explore Features

- Browse `/catalog` - Product catalog
- Visit `/dashboard` - Trader dashboard (requires login)
- Check `/intelligence` - Premium features (requires premium account)

### 3. Development

- Read `CONTRIBUTING.md` for development guidelines
- Check `docs/OOP_ARCHITECTURE.md` for code structure
- See `docs/API_DOCUMENTATION.md` for API reference

### 4. Deploy

- Frontend: Deploy to Vercel (see `docs/DEPLOYMENT.md`)
- Backend: Deploy with Docker (see `backend/Dockerfile`)

## Useful Commands

```bash
# Development
make dev              # Run dev servers
make install          # Install dependencies
make test             # Run tests

# Build
make build            # Build for production

# Database
make db-migrate       # Run migrations

# Docker
make docker-up        # Start containers
make docker-down      # Stop containers

# Clean
make clean            # Remove build artifacts
```

## Getting Help

- Documentation: `docs/` folder
- API Reference: `docs/API_DOCUMENTATION.md`
- Architecture: `docs/ARCHITECTURE_DIAGRAM.md`
- Issues: Open GitHub issue
- Email: dev@grawizah.com

## What's Next?

1. ✅ Setup complete
2. 📚 Read documentation in `docs/`
3. 🎨 Customize brand colors in `tailwind.config.ts`
4. 🔧 Add features following OOP patterns
5. 🚀 Deploy to production

---

**Congratulations! You're ready to build with Grawizah! 🎉**

**Grawizah Intelligence Hub - 2026**
*Secure, Fast, & Intelligent Global Trade*
