# Grawizah API Documentation

## Base URL
```
Production: https://api.grawizah.com
Development: http://localhost:8080
```

## Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Products

#### GET /api/products
Get paginated product list (AI-ranked)

**Query Parameters:**
- `page` (int) - Page number (default: 1)
- `limit` (int) - Items per page (default: 20)
- `category` (string) - Filter by category
- `country` (string) - Filter by country

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "description": "...",
      "hs_code": "123456",
      "price_range_min": 1000,
      "price_range_max": 5000,
      "currency": "USD",
      "listing_score": 85
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

#### GET /api/products/:id
Get single product details

#### POST /api/products
Create new product (Authenticated - Trader only)

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Detailed description",
  "category": "Agriculture",
  "country_origin": "Indonesia",
  "price_range_min": 1000,
  "price_range_max": 5000,
  "currency": "USD",
  "images": ["url1", "url2"]
}
```

### AI Services

#### POST /api/ai/hs-code
Classify HS Code using AI

**Request Body:**
```json
{
  "description": "Fresh coconut oil, virgin, organic",
  "category": "Agriculture"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hs_code": "151311",
    "confidence": 0.95,
    "description": "Coconut oil, virgin",
    "regulation_notes": "May require phytosanitary certificate"
  }
}
```

#### POST /api/ai/lead-score
Calculate buyer lead score

**Request Body:**
```json
{
  "buyer_id": "uuid",
  "product_category": "Agriculture",
  "inquiry_message": "Interested in bulk order"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "buy_score": 82,
    "conversion_probability": 0.82,
    "factors": {
      "import_frequency": 0.85,
      "volume_trend": 0.78,
      "category_match": 0.90
    }
  }
}
```

#### POST /api/ai/response-suggestion
Get AI-generated response suggestion

**Request Body:**
```json
{
  "inquiry_id": "uuid",
  "inquiry_message": "What is your MOQ?",
  "product_name": "Virgin Coconut Oil",
  "buyer_country": "USA"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggested_response": "Thank you for your interest...",
    "language": "English",
    "tone": "professional"
  }
}
```

### Buyer Radar (Premium Only)

#### GET /api/buyers/radar
Get buyer intelligence database

**Query Parameters:**
- `country` (string) - Filter by country
- `min_score` (int) - Minimum buy score (0-100)
- `category` (string) - Product category

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "company_name": "ABC Trading Inc",
      "country": "USA",
      "buy_score": 85,
      "verified": true,
      "last_import_date": "2026-03-15",
      "data_source": "comtrade"
    }
  ]
}
```

### Inquiries

#### GET /api/inquiries
Get inquiries for authenticated user

#### POST /api/inquiries
Create new inquiry (Buyer → Supplier)

**Request Body:**
```json
{
  "supplier_id": "uuid",
  "product_id": "uuid",
  "message": "Interested in your product...",
  "source_type": "chat"
}
```

#### PUT /api/inquiries/:id/respond
Respond to inquiry (Supplier)

**Request Body:**
```json
{
  "message": "Thank you for your interest..."
}
```

### Leaderboard (Premium Only)

#### GET /api/leaderboard
Get trader leaderboard rankings

**Response:**
```json
{
  "data": [
    {
      "rank": 1,
      "company_name": "PT Export Indonesia",
      "total_score": 92.5,
      "conversion_rate": 35.2,
      "repeat_buyer_rate": 28.5,
      "trend_7d": 2.3
    }
  ]
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Description of error",
    "details": {}
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401) - Missing or invalid token
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `INVALID_INPUT` (400) - Validation error
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests

## Rate Limiting

- **Free Tier**: 100 requests/hour
- **Premium Tier**: 1000 requests/hour
- **AI Endpoints**: 
  - Free: 3 HS Code requests/day
  - Premium: Unlimited
