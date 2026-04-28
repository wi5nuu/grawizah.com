# Grawizah - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Desktop    │          │
│  │  (Next.js)   │  │     App      │  │     App      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                              │
│                   Next.js 14 + TypeScript                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  App Router (SSR)                                         │  │
│  │  ├── / (Landing)                                          │  │
│  │  ├── /catalog (Products)                                  │  │
│  │  ├── /dashboard (Trader)                                  │  │
│  │  └── /intelligence (Premium)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OOP Layer                                                │  │
│  │  ├── Models (BaseEntity → Product, Inquiry)              │  │
│  │  ├── Services (BaseService → ProductService, AIService)  │  │
│  │  ├── Repositories (IRepository → SupabaseRepo)           │  │
│  │  └── Interfaces (IAIService, INotificationSender)        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY                                │
│                    REST + gRPC Protocol                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Rate Limiting (Redis/Upstash)                           │  │
│  │  Authentication (JWT)                                     │  │
│  │  CORS & Security Headers                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND LAYER                               │
│                      Golang + Gin                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Handlers (HTTP Request Handlers)                        │  │
│  │  ├── ProductHandler                                       │  │
│  │  ├── InquiryHandler                                       │  │
│  │  └── AIHandler                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                                │  │
│  │  ├── LeaderboardService                                   │  │
│  │  ├── InquiryService                                       │  │
│  │  └── AIService                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Repositories (Data Access)                               │  │
│  │  ├── ProductRepo                                          │  │
│  │  ├── InquiryRepo                                          │  │
│  │  └── BuyerRepo                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware                                               │  │
│  │  ├── AuthMiddleware                                       │  │
│  │  ├── RateLimiter                                          │  │
│  │  └── RoleGuard                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│    DATABASE LAYER        │  │    EXTERNAL SERVICES     │
│  PostgreSQL (Supabase)   │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │ Tables             │  │  │  │ Groq API           │ │
│  │ ├── users          │  │  │  │ (Llama 3)          │ │
│  │ ├── companies      │  │  │  │ - HS Code AI       │ │
│  │ ├── products       │  │  │  │ - Lead Scoring     │ │
│  │ ├── buyers         │  │  │  │ - Response AI      │ │
│  │ ├── inquiries      │  │  │  └────────────────────┘ │
│  │ └── leaderboard    │  │  │                          │
│  └────────────────────┘  │  │  ┌────────────────────┐ │
│  ┌────────────────────┐  │  │  │ UN Comtrade API    │ │
│  │ Views              │  │  │  │ (Trade Data)       │ │
│  │ ├── v_leaderboard  │  │  │  └────────────────────┘ │
│  │ ├── v_catalog      │  │  │                          │
│  │ └── v_conversion   │  │  │  ┌────────────────────┐ │
│  └────────────────────┘  │  │  │ Redis (Upstash)    │ │
│  ┌────────────────────┐  │  │  │ - Rate Limiting    │ │
│  │ Functions          │  │  │  │ - Session Cache    │ │
│  │ ├── calc_score()   │  │  │  │ - Leaderboard      │ │
│  │ └── get_buy_score()│  │  │  └────────────────────┘ │
│  └────────────────────┘  │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐ │
│  │ RLS Policies       │  │  │  │ WhatsApp Business  │ │
│  │ (Row-Level Sec)    │  │  │  │ API Integration    │ │
│  └────────────────────┘  │  │  └────────────────────┘ │
└──────────────────────────┘  └──────────────────────────┘
```

## OOP Implementation Across Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENCAPSULATION                                 │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:  Private fields + Getters/Setters                    │
│  Backend:   Unexported fields + Method receivers                │
│  Database:  RLS Policies + Stored Functions                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INHERITANCE                                   │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:  BaseEntityModel → ProductModel                      │
│  Backend:   BaseEntity embedded in Product                      │
│  Database:  Base fields in all tables                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    POLYMORPHISM                                  │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:  IAIService → HSCodeAI, LeadScoring                  │
│  Backend:   AIProvider → GroqProvider, FallbackProvider         │
│  Database:  Polymorphic fields (source_type, payload)           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ABSTRACTION                                   │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:  IRepository → SupabaseProductRepo                   │
│  Backend:   Repository interface → Concrete implementations     │
│  Database:  Views abstract complex JOINs                        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - Inquiry Creation Example

```
┌──────────┐
│  Buyer   │
│ (Client) │
└────┬─────┘
     │ 1. Click "Send Inquiry"
     ▼
┌──────────────────────────┐
│  Frontend (Next.js)      │
│  InquiryHandler.send()   │
└────┬─────────────────────┘
     │ 2. HTTP POST /api/inquiries
     ▼
┌──────────────────────────┐
│  API Gateway             │
│  - Auth Check (JWT)      │
│  - Rate Limit Check      │
└────┬─────────────────────┘
     │ 3. Authorized request
     ▼
┌──────────────────────────┐
│  Backend (Golang)        │
│  InquiryHandler          │
└────┬─────────────────────┘
     │ 4. Call service
     ▼
┌──────────────────────────┐
│  InquiryService          │
│  - Validate data         │
│  - Calculate lead score  │
└────┬─────────────────────┘
     │ 5. AI Lead Scoring
     ▼
┌──────────────────────────┐
│  AIService (Groq)        │
│  - Analyze buyer         │
│  - Return buy_score      │
└────┬─────────────────────┘
     │ 6. Save to DB
     ▼
┌──────────────────────────┐
│  InquiryRepository       │
│  - Insert inquiry        │
│  - Trigger notification  │
└────┬─────────────────────┘
     │ 7. Database write
     ▼
┌──────────────────────────┐
│  PostgreSQL (Supabase)   │
│  - Insert into inquiries │
│  - RLS check             │
│  - Trigger functions     │
└────┬─────────────────────┘
     │ 8. Real-time event
     ▼
┌──────────────────────────┐
│  Supabase Real-time      │
│  - Notify supplier       │
└────┬─────────────────────┘
     │ 9. WebSocket push
     ▼
┌──────────────────────────┐
│  Supplier Dashboard      │
│  - Show new inquiry      │
│  - Display buy_score     │
│  - AI response suggest   │
└──────────────────────────┘
```

## AI Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI TOUCHPOINTS                              │
└─────────────────────────────────────────────────────────────────┘

1. BUYER BROWSE CATALOG
   ├─→ AI Supplier Ranking
   └─→ Relevance score calculation

2. SUPPLIER UPLOAD PRODUCT
   ├─→ AI HS Code Classifier
   ├─→ AI Listing Optimizer
   └─→ Quality score calculation

3. BUYER SEND INQUIRY
   ├─→ AI Lead Scoring (real-time)
   └─→ Buy probability calculation

4. SUPPLIER RESPOND
   ├─→ AI Response Suggestion
   └─→ Multi-language support

5. SUPPLIER VIEW COMPETITORS
   ├─→ AI Competitor Benchmarking
   └─→ Price positioning analysis

6. MARKET MONITORING
   ├─→ AI Market Opportunity Alerts
   └─→ Pattern recognition

7. LEADERBOARD CALCULATION
   ├─→ AI-weighted scoring
   └─→ Business metrics analysis
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                      SECURITY STACK                              │
├─────────────────────────────────────────────────────────────────┤
│  Layer 1: TLS 1.3 (Transport)                                   │
│  Layer 2: JWT Authentication (Identity)                         │
│  Layer 3: Role-Based Access Control (Authorization)             │
│  Layer 4: Rate Limiting (Abuse Prevention)                      │
│  Layer 5: Row-Level Security (Data Isolation)                   │
│  Layer 6: AES-256 Encryption (Document Vault)                   │
│  Layer 7: Audit Logging (Compliance)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRODUCTION                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────┐             │
│  │  Vercel CDN      │         │  Docker Cloud    │             │
│  │  (Frontend)      │◄───────►│  (Backend)       │             │
│  │  - Next.js SSR   │         │  - Golang API    │             │
│  │  - Edge Functions│         │  - Auto-scaling  │             │
│  └──────────────────┘         └──────────────────┘             │
│           │                             │                        │
│           └─────────────┬───────────────┘                        │
│                         │                                        │
│                         ▼                                        │
│           ┌──────────────────────────┐                          │
│           │  Supabase Cloud          │                          │
│           │  - PostgreSQL            │                          │
│           │  - Real-time             │                          │
│           │  - Auth                  │                          │
│           │  - Storage               │                          │
│           └──────────────────────────┘                          │
│                         │                                        │
│                         ▼                                        │
│           ┌──────────────────────────┐                          │
│           │  External Services       │                          │
│           │  - Groq API              │                          │
│           │  - Upstash Redis         │                          │
│           │  - UN Comtrade API       │                          │
│           └──────────────────────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                      MONITORING STACK                            │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:  Vercel Analytics + Google Analytics 4               │
│  Backend:   Prometheus + Grafana                                │
│  Database:  Supabase Dashboard + Query Performance              │
│  Logs:      CloudWatch / Datadog                                │
│  Alerts:    PagerDuty / Slack Integration                       │
│  Uptime:    UptimeRobot / Pingdom                               │
└─────────────────────────────────────────────────────────────────┘
```

---

**Grawizah Intelligence Hub - 2026**
*Secure, Fast, & Intelligent Global Trade*
