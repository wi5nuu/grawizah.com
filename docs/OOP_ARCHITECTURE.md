# OOP Architecture - Grawizah Platform

## Overview

Grawizah mengimplementasikan prinsip Object-Oriented Programming (OOP) secara konsisten di seluruh 3 layer sistem:

1. **Frontend** - TypeScript Classes & Interfaces
2. **Backend** - Golang Structs & Interfaces  
3. **Database** - PostgreSQL RLS, Views & Functions

## 4 Pilar OOP

### 1. Encapsulation

**Frontend (TypeScript)**
```typescript
// src/models/Product.ts
export class ProductModel extends BaseEntityModel {
  private _price_range_min?: number;
  private _price_range_max?: number;
  
  // Getter - controlled access
  get priceRange(): string {
    return `${this._currency} ${this._price_range_min} - ${this._price_range_max}`;
  }
  
  // Setter - with validation
  setPriceRange(min: number, max: number): void {
    if (min > max) throw new Error('Invalid range');
    this._price_range_min = min;
    this._price_range_max = max;
  }
}
```

**Backend (Golang)**
```go
// backend/internal/models/product.go
type Product struct {
    BaseEntity
    priceRangeMin *float64 // unexported field
}

// Method receiver - controlled access
func (p *Product) SetPriceRange(min, max float64) error {
    if min > max {
        return ErrInvalidPriceRange
    }
    p.priceRangeMin = &min
    return nil
}
```

**Database (PostgreSQL)**
```sql
-- Row-Level Security (RLS) - data encapsulation
CREATE POLICY users_own_products ON products
    FOR ALL USING (company_id IN (
        SELECT id FROM companies WHERE owner_id = auth.uid()
    ));

-- Stored Function - logic encapsulation
CREATE FUNCTION calculate_leaderboard_score(company_uuid UUID)
RETURNS DECIMAL AS $$ ... $$;
```

### 2. Inheritance

**Frontend (TypeScript)**
```typescript
// Base class
export abstract class BaseEntityModel {
  protected _id: string;
  protected _created_at: string;
  
  abstract toJSON(): any;
}

// Child class inherits
export class ProductModel extends BaseEntityModel {
  // Inherits all base fields + methods
  toJSON(): Product { ... }
}
```

**Backend (Golang)**
```go
// Base struct
type BaseEntity struct {
    ID        string
    CreatedAt time.Time
    UpdatedAt time.Time
}

// Embedding = inheritance in Go
type Product struct {
    BaseEntity  // inherits all fields
    Name string
}
```

**Database (PostgreSQL)**
```sql
-- All tables inherit base fields
CREATE TABLE products (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    -- product-specific fields
    name VARCHAR(255)
);
```

### 3. Polymorphism

**Frontend (TypeScript)**
```typescript
// Interface contract
export interface IAIService {
  analyze(input: any): Promise<AIResult>;
}

// Different implementations
export class HSCodeAIService implements IAIService {
  async analyze(input: any): Promise<AIResult> { ... }
}

export class LeadScoringService implements IAIService {
  async analyze(input: any): Promise<AIResult> { ... }
}

// Caller doesn't care which implementation
const service: IAIService = new HSCodeAIService();
const result = await service.analyze(data);
```

**Backend (Golang)**
```go
// Interface
type AIProvider interface {
    Call(ctx context.Context, prompt string) (string, error)
}

// Different providers
type GroqProvider struct { ... }
func (g *GroqProvider) Call(...) (string, error) { ... }

type OpenAIProvider struct { ... }
func (o *OpenAIProvider) Call(...) (string, error) { ... }

// Runtime polymorphism
var provider AIProvider = &GroqProvider{}
result, _ := provider.Call(ctx, prompt)
```

**Database (PostgreSQL)**
```sql
-- Polymorphic inquiry source
CREATE TABLE inquiries (
    source_type inquiry_source_type, -- 'chat', 'whatsapp', 'email'
    source_metadata JSONB -- different structure per type
);

-- Polymorphic notification channel
CREATE TABLE notification_logs (
    channel notification_channel, -- 'email', 'whatsapp', 'inapp'
    payload JSONB -- different structure per channel
);
```

### 4. Abstraction

**Frontend (TypeScript)**
```typescript
// Abstract interface - hides implementation
export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
}

// Concrete implementation
export class SupabaseProductRepository implements IProductRepository {
  // Supabase details hidden from caller
  async findById(id: string): Promise<Product | null> {
    const { data } = await this.client.from('products')...
    return data;
  }
}

// Caller only knows interface
const repo: IProductRepository = new SupabaseProductRepository();
const product = await repo.findById('123');
```

**Backend (Golang)**
```go
// Abstract interface
type Repository[T any] interface {
    FindByID(ctx context.Context, id string) (*T, error)
}

// Implementation hidden
type SupabaseRepo struct { ... }
func (r *SupabaseRepo) FindByID(...) (*T, error) { ... }

// Middleware abstraction
func AuthMiddleware(c *gin.Context) {
    // Auth logic hidden from handlers
    c.Set("user_id", userId)
    c.Next()
}
```

**Database (PostgreSQL)**
```sql
-- View abstracts complex JOIN
CREATE VIEW v_leaderboard_ranked AS
SELECT 
    ls.*,
    c.name,
    ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank
FROM leaderboard_scores ls
JOIN companies c ON ls.company_id = c.id
-- Application just: SELECT * FROM v_leaderboard_ranked
```

## Mapping Across Layers

| Entity | Frontend | Backend | Database |
|--------|----------|---------|----------|
| Product | `src/models/Product.ts` | `internal/models/product.go` | `products` table |
| Inquiry | `src/models/Inquiry.ts` | `internal/models/inquiry.go` | `inquiries` table |
| Company | `src/models/Company.ts` | `internal/models/company.go` | `companies` table |

## Benefits

1. **Maintainability** - Changes isolated to specific classes/modules
2. **Testability** - Mock interfaces for unit testing
3. **Scalability** - Add new features without breaking existing code
4. **Security** - Encapsulation prevents unauthorized data access
5. **Consistency** - Same patterns across all layers

## Design Patterns Used

- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation
- **Strategy Pattern** - Leaderboard scoring algorithms
- **Factory Pattern** - AI provider instantiation
- **Observer Pattern** - Real-time notifications (Supabase)
