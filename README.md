# GRAWIZAH

**Pre-Transaction Intelligence & Deal Orchestration Platform**

> Secure, Fast, & Intelligent Global Trade

## 🎯 Overview

Grawizah adalah platform B2B yang menghubungkan supplier/trader lokal dengan pembeli global melalui lapisan pre-transaksi yang cerdas: dari penemuan buyer, kualifikasi peluang, hingga fasilitasi komunikasi awal yang terstruktur.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** (App Router, SSR)
- **TypeScript** (Full OOP Implementation)
- **Tailwind CSS** (Purple/Blue Theme)
- **Supabase** (Auth & Real-time DB)

### Backend
- **Golang** (High-performance API)
- **PostgreSQL** (Supabase)
- **Redis** (Upstash - Caching & Rate Limiting)

### AI Engine
- **Groq API** (Llama 3)
- **pgvector** (Embedding & Similarity Search)

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

## 🏗️ Project Structure

```
grawizah/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components (OOP)
│   ├── models/          # Business Entity Models
│   ├── services/        # API Services
│   ├── repositories/    # Data Access Layer
│   ├── hooks/           # Custom React Hooks
│   ├── interfaces/      # TypeScript Interfaces
│   ├── types/           # Type Definitions
│   └── lib/             # Utilities
├── backend/             # Golang Backend
│   ├── internal/
│   │   ├── models/
│   │   ├── services/
│   │   ├── repository/
│   │   ├── handlers/
│   │   └── middleware/
│   └── cmd/
└── database/            # SQL Schemas & Migrations

```

## 🎨 Brand Identity

- **Primary Purple**: `#6D28D9` (Deep Royal Purple)
- **Accent Blue**: `#3B82F6` (Electric Blue)
- **Typography**: Montserrat

## 🔑 Key Features

### Basic Intelligence (Free)
- ✅ AI-Ranked Product Catalog
- ✅ In-App Chat & WhatsApp Bridge
- ✅ AI HS Code Classifier (3x/day)
- ✅ AI Listing Optimizer
- ✅ Basic Inquiry Analytics

### Premium Intelligence
- 🚀 Full Buyer Radar + AI Lead Scoring
- 🚀 Competitor Benchmarking
- 🚀 Unlimited AI HS Code
- 🚀 AI Response Suggestion
- 🚀 Market Opportunity Alerts
- 🚀 Buyer Quality Score
- 🚀 Premium Badge

## 📊 OOP Architecture

Konsisten di 3 layer:
- **Frontend**: TypeScript Classes & Interfaces
- **Backend**: Golang Structs & Interfaces
- **Database**: RLS Policies & Views

## 🔒 Security

- AES-256 Encryption (Document Vault)
- Row-Level Security (Supabase RLS)
- JWT Authentication
- 2FA OTP Support
- PDPA-Aligned

## 📝 License

Confidential - Grawizah Intelligence Hub 2026

---

**grawizah.com** | Secure, Fast, & Intelligent Global Trade
