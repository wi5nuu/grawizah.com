-- Grawizah Database Schema
-- PostgreSQL / Supabase
-- Implements OOP principles through database design

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable pgvector for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('guest', 'free_trader', 'premium_trader', 'buyer', 'admin');
CREATE TYPE inquiry_source_type AS ENUM ('chat', 'whatsapp', 'email', 'rfq');
CREATE TYPE inquiry_status AS ENUM ('open', 'responded', 'closed');
CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp', 'inapp');

-- ============================================
-- BASE TABLES (Inheritance Pattern)
-- ============================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Companies table (inherits user relationship)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    nib VARCHAR(50),
    npwp VARCHAR(50),
    export_license VARCHAR(100),
    export_experience_years INT,
    export_countries TEXT[],
    description TEXT,
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    certifications TEXT[],
    logo_url VARCHAR(255),
    business_type VARCHAR(100),
    year_established INT,
    total_employees VARCHAR(50),
    score INT DEFAULT 98,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Products table (inherits company relationship)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hs_code VARCHAR(10),
    hs_code_confidence DECIMAL(3,2),
    price_range_min DECIMAL(15,2),
    price_range_max DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    moq INT,
    images TEXT[],
    category VARCHAR(100),
    country_origin VARCHAR(100),
    listing_score INT,
    view_count INT DEFAULT 0,
    inquiry_count INT DEFAULT 0,
    embedding vector(1536), -- For AI similarity search
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Buyers table
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    buy_score INT DEFAULT 0,
    verified BOOLEAN DEFAULT FALSE,
    last_import_date TIMESTAMP,
    data_source VARCHAR(50) DEFAULT 'estimated',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Inquiries table (Polymorphic source_type)
CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id),
    supplier_id UUID REFERENCES companies(id),
    product_id UUID REFERENCES products(id),
    message TEXT NOT NULL,
    source_type inquiry_source_type NOT NULL,
    source_metadata JSONB, -- Polymorphic metadata
    status inquiry_status DEFAULT 'open',
    response_time_hours DECIMAL(10,2),
    converted_to_deal BOOLEAN DEFAULT FALSE,
    buyer_rating INT,
    response_message TEXT,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Leaderboard Scores table
CREATE TABLE leaderboard_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) UNIQUE,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    repeat_buyer_rate DECIMAL(5,2) DEFAULT 0,
    response_rate DECIMAL(5,2) DEFAULT 0,
    buyer_rating DECIMAL(3,2) DEFAULT 0,
    catalog_completeness INT DEFAULT 0,
    fulfillment_success DECIMAL(5,2) DEFAULT 0,
    total_score DECIMAL(6,2) DEFAULT 0,
    rank INT,
    trend_7d DECIMAL(6,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- Notification Logs (Polymorphic channel)
CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    channel notification_channel NOT NULL,
    payload JSONB NOT NULL, -- Polymorphic payload
    sent_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'sent'
);

-- Document Vault (Encrypted storage)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id),
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    encrypted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_products_company ON products(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category ON products(category) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_embedding ON products USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX idx_inquiries_supplier ON inquiries(supplier_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_inquiries_buyer ON inquiries(buyer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_leaderboard_rank ON leaderboard_scores(rank) WHERE deleted_at IS NULL;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Encapsulation
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can only see their own products
CREATE POLICY users_own_products ON products
    FOR ALL
    USING (company_id IN (
        SELECT id FROM companies WHERE owner_id = auth.uid()
    ));

-- Buyers can only see their own documents
CREATE POLICY buyer_own_documents ON documents
    FOR ALL
    USING (buyer_id = auth.uid());

-- ============================================
-- STORED FUNCTIONS (Encapsulation)
-- ============================================

-- Calculate leaderboard score
CREATE OR REPLACE FUNCTION calculate_leaderboard_score(company_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    score DECIMAL;
BEGIN
    SELECT 
        (conversion_rate * 0.30) +
        (repeat_buyer_rate * 0.20) +
        (response_rate * 0.15) +
        (buyer_rating * 15) +
        (catalog_completeness * 0.10) +
        (fulfillment_success * 0.10)
    INTO score
    FROM leaderboard_scores
    WHERE company_id = company_uuid;
    
    RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql;

-- Get buyer quality score
CREATE OR REPLACE FUNCTION get_buy_score(buyer_uuid UUID)
RETURNS INT AS $$
DECLARE
    score INT;
BEGIN
    SELECT buy_score INTO score
    FROM buyers
    WHERE id = buyer_uuid;
    
    RETURN COALESCE(score, 0);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VIEWS (Abstraction)
-- ============================================

-- Leaderboard ranked view
CREATE OR REPLACE VIEW v_leaderboard_ranked AS
SELECT 
    ls.*,
    c.name as company_name,
    c.country,
    ROW_NUMBER() OVER (ORDER BY ls.total_score DESC) as dynamic_rank
FROM leaderboard_scores ls
JOIN companies c ON ls.company_id = c.id
WHERE ls.deleted_at IS NULL
ORDER BY ls.total_score DESC;

-- Product catalog view with AI ranking
CREATE OR REPLACE VIEW v_product_catalog AS
SELECT 
    p.*,
    c.name as company_name,
    c.verified as company_verified,
    c.country as company_country
FROM products p
JOIN companies c ON p.company_id = c.id
WHERE p.deleted_at IS NULL
ORDER BY p.listing_score DESC, p.view_count DESC;

-- Inquiry conversion rate view
CREATE OR REPLACE VIEW v_inquiry_conversion_rate AS
SELECT 
    supplier_id,
    COUNT(*) as total_inquiries,
    SUM(CASE WHEN converted_to_deal THEN 1 ELSE 0 END) as converted_deals,
    ROUND(
        (SUM(CASE WHEN converted_to_deal THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100,
        2
    ) as conversion_rate
FROM inquiries
WHERE deleted_at IS NULL
GROUP BY supplier_id;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES buyers(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    sender_id UUID NOT NULL, -- Could be user_id or buyer_id
    message TEXT NOT NULL,
    channel VARCHAR(50) DEFAULT 'chat',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Realtime for this table
ALTER publication supabase_realtime ADD TABLE chat_messages;

-- Create Index for faster lookup
CREATE INDEX idx_chat_messages_conversation ON chat_messages(supplier_id, buyer_id);

-- Fix documents table: add missing columns if not exists
ALTER TABLE documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100);
