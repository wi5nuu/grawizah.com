# Grawizah - Project Structure

```
grawizah/
│
├── src/                          # Frontend Source (Next.js 14 + TypeScript)
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   ├── globals.css          # Global styles (Tailwind)
│   │   ├── catalog/             # Product catalog pages
│   │   ├── dashboard/           # Trader dashboard
│   │   └── api/                 # API routes (if needed)
│   │
│   ├── components/              # React Components
│   │   ├── ui/                  # Base UI components (OOP)
│   │   │   └── BaseCard.tsx    # Base card component
│   │   ├── ProductCard.tsx     # Product display card
│   │   └── SupplierCard.tsx    # Supplier display card
│   │
│   ├── models/                  # Business Entity Models (OOP)
│   │   ├── BaseEntity.ts       # Base model class
│   │   ├── Product.ts          # Product model
│   │   ├── Inquiry.ts          # Inquiry model
│   │   └── Company.ts          # Company model
│   │
│   ├── services/                # API Services (OOP)
│   │   ├── BaseService.ts      # Base HTTP service
│   │   ├── ProductService.ts   # Product API calls
│   │   ├── AIService.ts        # AI feature services
│   │   └── InquiryService.ts   # Inquiry management
│   │
│   ├── repositories/            # Data Access Layer (OOP)
│   │   ├── IProductRepository.ts
│   │   └── SupabaseProductRepo.ts
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useInquiry.ts
│   │   ├── useBuyerRadar.ts
│   │   └── useLeaderboard.ts
│   │
│   ├── interfaces/              # TypeScript Interfaces
│   │   ├── IRepository.ts
│   │   ├── IAIService.ts
│   │   └── INotificationSender.ts
│   │
│   ├── types/                   # Type Definitions
│   │   ├── index.ts            # Core types & enums
│   │   ├── product.ts
│   │   ├── buyer.ts
│   │   ├── inquiry.ts
│   │   └── company.ts
│   │
│   └── lib/                     # Utilities
│       ├── supabase.ts
│       └── utils.ts
│
├── backend/                     # Backend Source (Golang)
│   ├── cmd/
│   │   └── main.go             # Application entry point
│   │
│   ├── internal/
│   │   ├── models/             # Domain Models (OOP)
│   │   │   ├── base_entity.go  # Base struct
│   │   │   ├── product.go
│   │   │   ├── inquiry.go
│   │   │   └── errors.go
│   │   │
│   │   ├── services/           # Business Logic (OOP)
│   │   │   ├── leaderboard_service.go
│   │   │   ├── inquiry_service.go
│   │   │   └── ai_service.go
│   │   │
│   │   ├── repository/         # Data Access (OOP)
│   │   │   ├── base_repo.go
│   │   │   ├── product_repo.go
│   │   │   └── inquiry_repo.go
│   │   │
│   │   ├── handlers/           # HTTP Handlers
│   │   │   ├── product_handler.go
│   │   │   └── inquiry_handler.go
│   │   │
│   │   ├── middleware/         # Middleware
│   │   │   ├── auth.go
│   │   │   ├── rate_limiter.go
│   │   │   └── role_guard.go
│   │   │
│   │   └── interfaces/         # Go Interfaces (OOP)
│   │       ├── repository.go
│   │       ├── ai_provider.go
│   │       └── notification.go
│   │
│   ├── go.mod                  # Go dependencies
│   ├── go.sum
│   └── Dockerfile              # Backend Docker image
│
├── database/                    # Database Schema & Migrations
│   ├── schema.sql              # Complete PostgreSQL schema
│   ├── migrations/             # Migration files
│   └── seeds/                  # Seed data
│
├── docs/                        # Documentation
│   ├── API_DOCUMENTATION.md    # API reference
│   ├── OOP_ARCHITECTURE.md     # OOP implementation guide
│   └── DEPLOYMENT.md           # Deployment guide
│
├── public/                      # Static Assets
│   ├── images/
│   └── icons/
│
├── .github/                     # GitHub Configuration
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── README.md                    # Project overview
├── CONTRIBUTING.md              # Contribution guidelines
├── PROJECT_STRUCTURE.md         # This file
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.js               # Next.js config
├── .env.example                 # Environment template
├── .gitignore
├── Makefile                     # Development commands
├── docker-compose.yml           # Docker orchestration
└── Dockerfile.frontend          # Frontend Docker image
```

## Key Directories Explained

### Frontend (`src/`)
- **app/** - Next.js 14 App Router pages
- **models/** - OOP business entity classes
- **services/** - API communication layer
- **repositories/** - Data access abstraction
- **interfaces/** - TypeScript contracts
- **types/** - Type definitions & enums

### Backend (`backend/`)
- **cmd/** - Application entry point
- **internal/models/** - Domain models (structs)
- **internal/services/** - Business logic
- **internal/repository/** - Database access
- **internal/handlers/** - HTTP request handlers
- **internal/middleware/** - Request middleware
- **internal/interfaces/** - Go interfaces

### Database (`database/`)
- **schema.sql** - Complete database schema
- Tables, Views, Functions, RLS Policies
- Implements OOP through database design

## OOP Implementation

Each layer implements the 4 OOP pillars:

1. **Encapsulation** - Private fields, getters/setters, RLS
2. **Inheritance** - Base classes/structs, table inheritance
3. **Polymorphism** - Interfaces, polymorphic fields
4. **Abstraction** - Repository pattern, views, functions

See `docs/OOP_ARCHITECTURE.md` for detailed examples.

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Golang, Gin Framework
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis (Upstash)
- **AI**: Groq API (Llama 3)
- **Auth**: Supabase Auth + JWT
- **Deployment**: Vercel (Frontend), Docker (Backend)

## Getting Started

```bash
# Install dependencies
make install

# Run development servers
make dev

# Build for production
make build

# Run tests
make test
```

See `README.md` for detailed setup instructions.
