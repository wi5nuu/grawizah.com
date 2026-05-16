# 🧪 GRAWIZAH — Manual Testing Guide

**Project:** Grawizah — Pre-Transaction Intelligence & Deal Orchestration Platform
**Team:** Successful Failures | President University
**Competition:** TechSprint Innovation Cup 2026
**Version:** 1.0.0 — May 2026

---

## 📋 Table of Contents

1. [Testing Overview & Objectives](#1-testing-overview--objectives)
2. [Test Environment Setup](#2-test-environment-setup)
3. [User Registration & Authentication](#3-user-registration--authentication)
4. [Supplier Journey — Full E2E Flow](#4-supplier-journey--full-e2e-flow)
5. [Buyer Journey — Full E2E Flow](#5-buyer-journey--full-e2e-flow)
6. [AI Features Testing](#6-ai-features-testing)
7. [Dashboard & Analytics](#7-dashboard--analytics)
8. [Inquiry & Communication Flow](#8-inquiry--communication-flow)
9. [Leaderboard & Gamification](#9-leaderboard--gamification)
10. [Settings & Profile Management](#10-settings--profile-management)
11. [Security & Access Control](#11-security--access-control)
12. [UI/UX & Responsiveness](#12-uiux--responsiveness)
13. [Error Handling & Edge Cases](#13-error-handling--edge-cases)
14. [API Endpoint Testing](#14-api-endpoint-testing)
15. [Known Issues & Bugs](#15-known-issues--bugs)
16. [Test Result Documentation Template](#16-test-result-documentation-template)

---

## 1. Testing Overview & Objectives

### 1.1 Purpose

This manual testing guide ensures that Grawizah functions correctly as a **Pre-Transaction Intelligence & Deal Orchestration Platform** — connecting local suppliers/traders with global buyers through AI-powered insights, inquiry management, and deal preparation tools.

### 1.2 Testing Goals

| # | Goal | Criteria |
|---|------|----------|
| G1 | **All user flows work end-to-end** | Registration → Login → Core Action → Expected Output |
| G2 | **AI features return valid results** | HS Code, Lead Scoring, Listing Optimizer, Translator all respond correctly |
| G3 | **Role-based access is enforced** | Supplier sees supplier features, Buyer sees buyer features, Guests see limited views |
| G4 | **Inquiry orchestration works** | Inquiry sent → received → responded → tracked in dashboard |
| G5 | **Leaderboard reflects real metrics** | Scores update based on conversion rate, repeat buyers, response rate |
| G6 | **Security is airtight** | No unauthorized access, JWT works, RLS policies enforced |
| G7 | **UI is responsive and consistent** | Dark/light mode, mobile/tablet/desktop, no layout breaks |

### 1.3 User Roles Tested

| Role | Description | Access Level |
|------|-------------|--------------|
| **Guest** | Unauthenticated visitor | Browse catalog only, no inquiry |
| **Free Trader (Supplier)** | Registered supplier, free tier | Basic directory, 3 AI HS Code/day, chat, limited analytics |
| **Premium Intelligence (Supplier)** | Registered supplier, paid tier | Full Buyer Radar, unlimited AI, benchmarking, lead scoring |
| **Buyer** | Registered buyer | RFQ creation, supplier discovery, document vault, inquiry manager |
| **Admin** | Platform administrator | Full access, leaderboard management |

### 1.4 Test Data

Use these test accounts (create during testing):

> **Note on Roles:** The backend uses `free_trader` and `premium_trader` as the actual enum values in the database (defined in `schema.sql` as `user_role` enum: `'guest', 'free_trader', 'premium_trader', 'buyer', 'admin'`). The frontend registration form may display these as "Supplier (Free)" and "Supplier (Premium)" — the mapping is: Supplier Free → `free_trader`, Supplier Premium → `premium_trader`.

```
Supplier Free:
  Email: supplier_free@test.com
  Password: TestPass123!
  Role: free_trader

Supplier Premium:
  Email: supplier_premium@test.com
  Password: TestPass123!
  Role: premium_trader

Buyer:
  Email: buyer@test.com
  Password: TestPass123!
  Role: buyer
```

---

## 2. Test Environment Setup

### 2.1 Prerequisites Checklist

Before starting tests, verify:

- [ ] Backend running on `http://localhost:8080`
- [ ] Frontend running on `http://localhost:3000`
- [ ] Supabase project active with schema deployed
- [ ] Groq API key configured and valid
- [ ] Redis/Upstash configured (or rate limiting disabled for local testing)
- [ ] Database seeded with sample data (products, companies, sample buyers)

### 2.2 Health Check

**TEST-ENV-001: Backend Health**

```bash
curl http://localhost:8080/health
```

**Expected:**
```json
{
  "status": "healthy",
  "service": "grawizah-api",
  "version": "1.0.0"
}
```

**TEST-ENV-002: Frontend Loads**

Open `http://localhost:3000` in browser.

**Expected:** Landing page renders with hero section, navigation, and CTA buttons. No console errors.

**TEST-ENV-003: Database Connectivity**

Register a new user via the frontend.

**Expected:** User appears in Supabase `users` table.

### 2.3 Browser Setup

Test on these browsers (minimum):
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Microsoft Edge (latest)

Open DevTools (F12) → Console tab. No red errors should appear during any test.

---

## 3. User Registration & Authentication

### 3.1 Registration

#### TEST-AUTH-001: Supplier Registration — Happy Path

**Precondition:** On `http://localhost:3000/register`

**Steps:**
1. Navigate to `/register`
2. Enter full name: `Test Supplier`
3. Enter email: `supplier_free@test.com`
4. Enter password: `TestPass123!`
5. Confirm password: `TestPass123!`
6. Select role: `Supplier` (maps to `free_trader` in backend)
7. Click "Register" button

**Expected Result:**
- Success message displayed
- User redirected to `/dashboard` or email verification page
- User record created in Supabase with role `free_trader`
- Access token stored in browser (check Application → LocalStorage or Cookies)
- **Backend response:** `200 OK` with `{"message": "User registered successfully", "user": {...}}`

> **Note:** The backend `Register` handler accepts `full_name`, `email`, `password`, and optional `role` (defaults to `free_trader`). The `role` is stored in Supabase `user_metadata`. The frontend must send `full_name` in the request body.

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-002: Buyer Registration — Happy Path

**Steps:**
1. Navigate to `/register`
2. Enter full name: `Test Buyer`
3. Enter email: `buyer@test.com`
4. Enter password: `TestPass123!`
5. Confirm password: `TestPass123!`
6. Select role: `Buyer`
7. Click "Register" button

**Expected Result:**
- Success message displayed
- User redirected to `/dashboard`
- User record created with role `buyer`
- **Backend response:** `200 OK` with `{"message": "User registered successfully", "user": {...}}`

> **Note:** The backend stores the role in Supabase `user_metadata`. The `AuthMiddleware` extracts it from `user_metadata.role` in the JWT claims.

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-003: Registration — Duplicate Email

**Steps:**
1. Navigate to `/register`
2. Enter email: `supplier_free@test.com` (already registered)
3. Fill other fields validly
4. Click "Register"

**Expected Result:**
- Error message displayed (Supabase returns `"User already registered"` or `"A user with this email already exists"`)
- No new user created
- User stays on registration page
- **Backend response:** `400 Bad Request` with error from Supabase

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-004: Registration — Invalid Email Format

**Steps:**
1. Navigate to `/register`
2. Enter email: `not-an-email`
3. Fill other fields validly
4. Click "Register"

**Expected Result:**
- Validation error on email field
- Form not submitted

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-005: Registration — Weak Password

**Steps:**
1. Navigate to `/register`
2. Enter password: `123`
3. Fill other fields validly
4. Click "Register"

**Expected Result:**
- Validation error: password too short / weak
- Form not submitted

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-006: Registration — Password Mismatch

**Steps:**
1. Navigate to `/register`
2. Enter password: `TestPass123!`
3. Confirm password: `DifferentPass123!`
4. Click "Register"

**Expected Result:**
- Validation error: "Passwords do not match"
- Form not submitted

**Status:** ⬜ Pass ⬜ Fail

---

### 3.2 Login

#### TEST-AUTH-007: Login — Valid Credentials (Supplier)

**Steps:**
1. Navigate to `/login`
2. Enter email: `supplier_free@test.com`
3. Enter password: `TestPass123!`
4. Click "Login"

**Expected Result:**
- Redirected to `/dashboard`
- Dashboard shows **Supplier** view (product management, inquiry analytics, etc.)
- Navbar shows user name / avatar
- Supabase access token present in localStorage or cookies
- **Backend response:** `200 OK` with `{"token": "<supabase_access_token>", "user": {...}}`

> **Note:** The backend `Login` handler calls Supabase Auth (`/auth/v1/token?grant_type=password`) and returns the Supabase `access_token` directly. This is a Supabase JWT, not a custom JWT. The `AuthMiddleware` validates it using the `JWT_SECRET` environment variable (which should match Supabase's JWT secret).

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-008: Login — Valid Credentials (Buyer)

**Steps:**
1. Navigate to `/login`
2. Enter email: `buyer@test.com`
3. Enter password: `TestPass123!`
4. Click "Login"

**Expected Result:**
- Redirected to `/dashboard`
- Dashboard shows **Buyer** view (RFQ management, supplier discovery, etc.)
- Navbar shows user name / avatar
- Supabase access token present in localStorage or cookies

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-009: Login — Wrong Password

**Steps:**
1. Navigate to `/login`
2. Enter email: `supplier_free@test.com`
3. Enter password: `WrongPassword123!`
4. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials" or similar (Supabase returns `"Invalid login credentials"`)
- User stays on login page
- No access token stored

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-010: Login — Non-existent Email

**Steps:**
1. Navigate to `/login`
2. Enter email: `doesnotexist@test.com`
3. Enter password: `TestPass123!`
4. Click "Login"

**Expected Result:**
- Error message: "Invalid credentials" or similar
- User stays on login page

**Status:** ⬜ Pass ⬜ Fail

---

### 3.3 Session Management

#### TEST-AUTH-011: Session Persists After Page Refresh

**Precondition:** Logged in as supplier

**Steps:**
1. Login as supplier
2. Navigate to `/dashboard`
3. Press F5 (refresh page)

**Expected Result:**
- User remains logged in
- Dashboard still shows supplier view
- No redirect to login page

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-012: Logout

**Precondition:** Logged in

**Steps:**
1. Click user avatar/name in navbar
2. Click "Logout"

**Expected Result:**
- Redirected to `/` (landing page) or `/login`
- Supabase access token removed from localStorage/cookies
- Navbar shows "Login" / "Register" buttons
- Attempting to access `/dashboard` redirects to login

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-013: Protected Route — Unauthenticated Access

**Precondition:** Logged out

**Steps:**
1. Directly navigate to `http://localhost:3000/dashboard`

**Expected Result:**
- Redirected to `/login`
- No dashboard content visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AUTH-014: Token Expiry Handling

**Precondition:** Logged in

**Steps:**
1. Login successfully
2. Manually delete/modify the Supabase access token in localStorage
3. Navigate to any protected page

**Expected Result:**
- Redirected to login page
- Error message about session expiry (optional but good)

> **Note:** The backend uses Supabase JWT tokens which have a default expiry. The `AuthMiddleware` validates token expiry automatically via the `jwt.Parse` call.

**Status:** ⬜ Pass ⬜ Fail

---

## 4. Supplier Journey — Full E2E Flow

### 4.1 Dashboard Overview

#### TEST-SUP-001: Supplier Dashboard Loads

**Precondition:** Logged in as supplier

**Steps:**
1. Login as `supplier_free@test.com`
2. Navigate to `/dashboard`

**Expected Result:**
- Dashboard loads without errors
- Stats cards visible (inquiries count, products count, intelligence score)
- Recent inquiries section visible
- Sidebar shows supplier-specific navigation (Catalog, Inquiries, Intelligence, Leaderboard, Settings)
- No buyer-specific features visible (RFQ, Document Vault)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-002: Dashboard Stats Are Accurate

**Precondition:** Supplier has 3 products and 5 inquiries in database

**Steps:**
1. Login as supplier with known data
2. View dashboard stats cards

**Expected Result:**
- Products count matches database
- Inquiries count matches database
- Numbers are real-time (not hardcoded)

**Status:** ⬜ Pass ⬜ Fail

---

### 4.2 Product Catalog Management

#### TEST-SUP-003: View Product Catalog

**Precondition:** Logged in as supplier with existing products

**Steps:**
1. Navigate to `/dashboard/catalog`

**Expected Result:**
- Product list loads
- Each product shows: name, image, HS Code, price range, status
- Stats cards at top (total products, active, draft)
- "Add Product" button visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-004: Add New Product — Happy Path

**Steps:**
1. Navigate to `/dashboard/catalog`
2. Click "Add Product" button
3. Fill form:
   - Name: `Premium Palm Oil`
   - Category: `Agriculture`
   - HS Code: `1511.90` (or use AI classifier — see AI tests)
   - Price Range: `$500 - $800 / MT`
   - Description: `High-quality refined palm oil for food industry`
   - Upload product image
4. Click "Save" / "Publish"

**Expected Result:**
- Success message displayed
- Product appears in catalog list
- Product record created in database
- Image uploaded to Supabase storage

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-005: Add Product — Missing Required Fields

**Steps:**
1. Navigate to `/dashboard/catalog`
2. Click "Add Product"
3. Leave name empty
4. Click "Save"

**Expected Result:**
- Validation error on name field
- Product not created

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-006: Edit Existing Product

**Precondition:** Product exists in catalog

**Steps:**
1. Navigate to `/dashboard/catalog`
2. Click edit icon on a product
3. Change name: `Updated Product Name`
4. Click "Save"

**Expected Result:**
- Success message displayed
- Product name updated in list
- Database record updated

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-007: Delete Product

**Precondition:** Product exists in catalog

**Steps:**
1. Navigate to `/dashboard/catalog`
2. Click delete icon on a product
3. Confirm deletion in dialog

**Expected Result:**
- Confirmation dialog appears
- After confirm: product removed from list
- Database: product `deleted_at` set (soft delete), not permanently removed

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-008: Delete Product — Cancel

**Steps:**
1. Click delete icon on a product
2. Click "Cancel" in confirmation dialog

**Expected Result:**
- Dialog closes
- Product still in list
- No database change

**Status:** ⬜ Pass ⬜ Fail

---

### 4.3 Supplier Inquiry Management

#### TEST-SUP-009: View Inquiries

**Precondition:** Supplier has received inquiries

**Steps:**
1. Navigate to `/dashboard/inquiries`

**Expected Result:**
- Inquiry list loads
- Filter tabs visible: All, Open, Responded, Closed
- Each inquiry shows: buyer name, product, date, status badge
- Stats cards at top

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-010: Respond to Inquiry

**Steps:**
1. Navigate to `/dashboard/inquiries`
2. Click on an open inquiry
3. Type response: `Thank you for your interest. We can supply 20MT at $650/MT FOB Jakarta.`
4. Click "Send Response"

**Expected Result:**
- Response sent successfully
- Inquiry status changes to "Responded"
- Response visible in inquiry thread
- Buyer receives notification (if implemented)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-011: Mark Inquiry as Converted

**Steps:**
1. Navigate to `/dashboard/inquiries`
2. Click on a responded inquiry
3. Click "Mark as Converted"

**Expected Result:**
- Inquiry status changes to "Converted"
- Stats update to reflect conversion
- Leaderboard score affected (conversion rate metric)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SUP-012: Filter Inquiries by Status

**Steps:**
1. Navigate to `/dashboard/inquiries`
2. Click "Open" tab
3. Click "Responded" tab
4. Click "Closed" tab
5. Click "All" tab

**Expected Result:**
- Each tab filters correctly
- Only inquiries with matching status shown
- Count updates per tab

**Status:** ⬜ Pass ⬜ Fail

---

## 5. Buyer Journey — Full E2E Flow

### 5.1 Buyer Dashboard

#### TEST-BUY-001: Buyer Dashboard Loads

**Precondition:** Logged in as buyer

**Steps:**
1. Login as `buyer@test.com`
2. Navigate to `/dashboard`

**Expected Result:**
- Dashboard loads without errors
- Stats cards visible (RFQs created, verified sources, savings)
- Quick actions visible (Create RFQ, Browse Suppliers, Document Vault)
- Sidebar shows buyer-specific navigation
- No supplier-specific features visible (product catalog, inquiry analytics)

**Status:** ⬜ Pass ⬜ Fail

---

### 5.2 Supplier Discovery & Catalog Browsing

#### TEST-BUY-002: Browse Supplier Catalog (Authenticated)

**Precondition:** Logged in as buyer

**Steps:**
1. Navigate to `/dashboard/catalog` or browse suppliers
2. View product listings

**Expected Result:**
- Products display with full details (price, HS Code, supplier info)
- AI-ranked suppliers appear first
- Search and filter options work
- "Send Inquiry" button visible on products

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-003: Browse Catalog as Guest (Unauthenticated)

**Precondition:** Logged out

**Steps:**
1. Navigate to `/` (landing) or public catalog
2. View product listings

**Expected Result:**
- Products display with limited info
- Price shows as range only
- "Send Inquiry" button hidden or prompts login
- Upgrade/Register CTA visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-004: Search Products

**Steps:**
1. Navigate to catalog
2. Type "palm oil" in search bar
3. Press Enter

**Expected Result:**
- Results filtered to matching products
- Search is case-insensitive
- No results message when nothing matches

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-005: Filter Products by Category

**Steps:**
1. Navigate to catalog
2. Select "Agriculture" from category filter

**Expected Result:**
- Only agriculture products shown
- Other categories hidden
- Filter can be cleared

**Status:** ⬜ Pass ⬜ Fail

---

### 5.3 RFQ Management

#### TEST-BUY-006: Create RFQ — Happy Path

**Precondition:** Logged in as buyer

**Steps:**
1. Navigate to `/dashboard/rfq` or click "Create RFQ"
2. Fill form:
   - Product: `Crude Palm Oil`
   - Quantity: `20 MT`
   - Target Price: `$600/MT`
   - Destination Port: `Rotterdam`
   - Delivery Date: `2026-07-01`
   - Additional Requirements: `ISO 22000 certified`
3. Click "Publish RFQ"

**Expected Result:**
- RFQ created successfully
- RFQ appears in buyer's RFQ list
- Relevant suppliers notified (if implemented)
- RFQ status: "Open"

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-007: View RFQ List

**Steps:**
1. Navigate to RFQ management page

**Expected Result:**
- All buyer's RFQs listed
- Each shows: product, quantity, status, date, responses count
- Filter by status works

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-008: View RFQ Responses

**Steps:**
1. Click on an RFQ with responses
2. View supplier responses

**Expected Result:**
- List of supplier responses
- Each shows: supplier name, price, terms, rating
- Can compare suppliers side-by-side

**Status:** ⬜ Pass ⬜ Fail

---

### 5.4 Supplier Comparison

#### TEST-BUY-009: Compare Suppliers

**Precondition:** Multiple suppliers exist

**Steps:**
1. Navigate to supplier comparison page
2. Select 2-3 suppliers
3. Click "Compare"

**Expected Result:**
- Side-by-side comparison table
- Shows: price, rating, response rate, catalog completeness, deal probability
- AI recommendation highlighted

**Status:** ⬜ Pass ⬜ Fail

---

### 5.5 Document Vault

#### TEST-BUY-010: Upload Document to Vault

**Precondition:** Logged in as buyer

**Steps:**
1. Navigate to `/dashboard/documents` or Document Vault
2. Click "Upload Document"
3. Select a PDF file (e.g., `test_document.pdf`)
4. Enter document name: `Import License`
5. Click "Upload"

**Expected Result:**
- File uploads successfully
- Document appears in vault list
- Encryption notice displayed
- File stored in Supabase storage with AES-256 encryption

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-011: Download Document from Vault

**Steps:**
1. Navigate to Document Vault
2. Click download on an uploaded document

**Expected Result:**
- File downloads correctly
- File content matches original upload

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-012: Delete Document from Vault

**Steps:**
1. Navigate to Document Vault
2. Click delete on a document
3. Confirm deletion

**Expected Result:**
- Document removed from list
- File removed from storage

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-013: Document Vault — File Size Limit

**Steps:**
1. Try to upload a file larger than 10MB

**Expected Result:**
- Error message: "File size exceeds 10MB limit"
- Upload rejected

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-BUY-014: Document Vault — File Type Restriction

**Steps:**
1. Try to upload an `.exe` file

**Expected Result:**
- Error message: "File type not allowed"
- Upload rejected

**Status:** ⬜ Pass ⬜ Fail

---

## 6. AI Features Testing

### 6.1 AI HS Code Classifier

#### TEST-AI-001: Classify Product — Clear Description

**Precondition:** Logged in as supplier

**Steps:**
1. Navigate to `/dashboard/intelligence` → HS Code Classifier tab
2. Enter product description: `Crude Palm Oil`
3. Select category: `Agriculture`
4. Click "Classify"

**Expected Result:**
- HS Code returned (e.g., `1511.10`)
- Confidence score displayed (e.g., `95%`)
- Response time < 2 seconds
- Result displayed with explanation

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-002: Classify Product — Ambiguous Description

**Steps:**
1. Enter description: `Mixed vegetable oil blend`
2. Click "Classify"

**Expected Result:**
- HS Code returned with lower confidence score
- Multiple possible codes listed (if implemented)
- Confidence score reflects ambiguity

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-003: Classify Product — Empty Input

**Steps:**
1. Leave description empty
2. Click "Classify"

**Expected Result:**
- Validation error: "Please enter a product description"
- No API call made

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-004: Rate Limiting — Free Tier (3/day)

**Precondition:** Logged in as free-tier supplier

**Steps:**
1. Classify 3 different products (use up daily limit)
4. Try to classify a 4th product

**Expected Result:**
- First 3 classifications succeed
- 4th attempt shows: "Daily limit reached. Upgrade to Premium for unlimited access."
- Counter shows "3/3 used"

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-005: Rate Limiting — Premium Tier (Unlimited)

**Precondition:** Logged in as premium-tier supplier

**Steps:**
1. Classify 5+ products in a row

**Expected Result:**
- All classifications succeed
- No rate limit message
- Counter shows unlimited or no counter

**Status:** ⬜ Pass ⬜ Fail

---

### 6.2 AI Listing Optimizer

#### TEST-AI-006: Optimize Product Listing

**Precondition:** Logged in as supplier

**Steps:**
1. Navigate to `/dashboard/intelligence` → Listing Optimizer tab
2. Enter listing details:
   - Title: `Palm Oil`
   - Description: `Good quality`
   - HS Code: `1511`
3. Click "Analyze"

**Expected Result:**
- Quality score returned (e.g., `45/100`)
- Specific suggestions provided:
  - "Add more keywords to title"
  - "Description too short — add specifications"
  - "Add product images"
- Suggestions are actionable

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-007: Optimize — Well-Written Listing

**Steps:**
1. Enter a detailed, well-optimized listing
2. Click "Analyze"

**Expected Result:**
- High quality score (e.g., `85-100/100`)
- Few or no suggestions
- Positive feedback message

**Status:** ⬜ Pass ⬜ Fail

---

### 6.3 AI Response Suggestion

#### TEST-AI-008: Generate Response Suggestion

**Precondition:** Logged in as supplier with an open inquiry

**Steps:**
1. Navigate to an open inquiry
2. Click "AI Suggest Response" button

**Expected Result:**
- AI generates a professional response draft
- Response references the inquiry context (product, quantity, etc.)
- Response is in appropriate language
- Supplier can edit before sending

**Status:** ⬜ Pass ⬜ Fail

---

### 6.4 AI Translator

#### TEST-AI-009: Translate Message

**Steps:**
1. Navigate to chat or translator tool
2. Enter text: `We can supply 20MT at competitive prices`
3. Select target language: `Indonesian`
4. Click "Translate"

**Expected Result:**
- Translation displayed: `Kami dapat memasok 20MT dengan harga kompetitif`
- Translation is accurate
- Response time < 2 seconds

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-010: Detect Language

**Steps:**
1. Enter text: `Nous cherchons de l'huile de palme`
2. Click "Detect Language"

**Expected Result:**
- Detected language: `French`
- Confidence score displayed

**Status:** ⬜ Pass ⬜ Fail

---

### 6.5 AI Lead Scoring (Buyer Radar) — Premium Only

#### TEST-AI-011: View Buyer Radar

**Precondition:** Logged in as premium supplier

**Steps:**
1. Navigate to `/dashboard/intelligence` → Buyer Radar tab

**Expected Result:**
- Buyer list loads with Buy Score (0-100)
- Each buyer shows: name, country, score, import frequency, last active
- Sorted by score (highest first)
- Export to CSV button visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-012: Buyer Radar — Free Tier Access Denied

**Precondition:** Logged in as free-tier supplier

**Steps:**
1. Navigate to Buyer Radar tab

**Expected Result:**
- Upgrade prompt displayed
- "Upgrade to Premium for full Buyer Radar access"
- No buyer data visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-013: Buy Score Accuracy

**Precondition:** Buyer with known import history

**Steps:**
1. View a specific buyer in Buyer Radar
2. Check their Buy Score

**Expected Result:**
- Score reflects actual import frequency and volume
- Score is between 0-100
- Score breakdown visible (if implemented): import frequency, volume trend, category match

**Status:** ⬜ Pass ⬜ Fail

---

### 6.6 Competitor Benchmarking — Premium Only

#### TEST-AI-014: View Price Benchmark

**Precondition:** Logged in as premium supplier

**Steps:**
1. Navigate to `/dashboard/intelligence` → Competitor Benchmarking tab
2. Select product category: `Palm Oil`

**Expected Result:**
- Price chart/bar graph renders
- Shows average, min, max prices per country
- Your price position indicated
- Data source labeled (UN Comtrade, etc.)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-015: Benchmark — Price Outlier Detection

**Precondition:** Your price is significantly different from market average

**Steps:**
1. View benchmark for a product where your price is an outlier

**Expected Result:**
- Alert/warning displayed: "Your price is 30% above market average"
- Suggestion to adjust price

**Status:** ⬜ Pass ⬜ Fail

---

### 6.7 Market Opportunity Alerts

#### TEST-AI-016: View Market Alerts

**Precondition:** Logged in as premium supplier

**Steps:**
1. Navigate to `/dashboard/intelligence` → Market Alerts tab

**Expected Result:**
- List of market opportunity alerts
- Each alert shows: product, country, demand spike %, date
- Alerts are relevant to supplier's product categories

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-AI-017: Market Alert Detail

**Steps:**
1. Click on a market alert

**Expected Result:**
- Detailed view with:
  - Demand trend chart
  - Top importing countries
  - Suggested actions
  - "Find Buyers" CTA

**Status:** ⬜ Pass ⬜ Fail

---

## 7. Dashboard & Analytics

### 7.1 Supplier Dashboard Analytics

#### TEST-DASH-001: Inquiry Analytics Display

**Precondition:** Supplier with inquiry history

**Steps:**
1. Navigate to `/dashboard`
2. View inquiry analytics section

**Expected Result:**
- Total inquiries count
- Response rate percentage
- Conversion rate percentage
- Chart/graph showing inquiry trends over time

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-DASH-002: Inquiry Analytics — Real-Time Update

**Steps:**
1. Note current inquiry count
2. Have a buyer send a new inquiry (or create via API)
3. Refresh dashboard

**Expected Result:**
- Inquiry count incremented
- New inquiry appears in recent list
- Stats updated without manual refresh (if real-time)

**Status:** ⬜ Pass ⬜ Fail

---

### 7.2 Trade Intelligence Page

#### TEST-DASH-003: Trade Intelligence Page Loads

**Steps:**
1. Navigate to `/dashboard/intelligence`

**Expected Result:**
- Page loads with tab navigation
- Tabs: Buyer Radar, HS Code Classifier, Price Benchmark, Listing Optimizer, Market Alerts
- Active tab content displays correctly
- Tab switching works smoothly

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-DASH-004: Trade Network Map

**Steps:**
1. Navigate to Trade Network Map section

**Expected Result:**
- Interactive node-graph visualization renders
- Nodes represent buyers/suppliers
- Connections show trade relationships
- Zoom and pan work

**Status:** ⬜ Pass ⬜ Fail

---

## 8. Inquiry & Communication Flow

### 8.1 End-to-End Inquiry Flow

#### TEST-INQ-001: Full Inquiry Flow — Buyer to Supplier

**Precondition:** Buyer and supplier accounts exist, supplier has products

**Steps:**
1. **As Buyer:** Login → Browse catalog → Click "Send Inquiry" on a product
2. Fill inquiry form:
   - Quantity: `20 MT`
   - Target Price: `$600/MT`
   - Message: `Interested in your palm oil. Please send best offer.`
   - Delivery: `FOB Jakarta`
3. Click "Send Inquiry"
4. **As Supplier:** Login → Navigate to `/dashboard/inquiries`
5. Verify new inquiry appears
6. Click on inquiry → View details
7. Type response: `We can offer at $650/MT FOB Jakarta. MOQ 20MT.`
8. Click "Send Response"
9. **As Buyer:** Login → Check inquiries
10. Verify response received

**Expected Result:**
- Inquiry sent successfully by buyer
- Supplier receives inquiry in dashboard
- Supplier can view full inquiry details
- Supplier response sent successfully
- Buyer receives response
- Inquiry status updates correctly at each step
- Both parties can see the conversation thread

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-INQ-002: Inquiry via WhatsApp Bridge

**Precondition:** Twilio WhatsApp configured (or mock for testing)

**Steps:**
1. Supplier enables WhatsApp bridge in settings
2. Buyer sends inquiry
3. Supplier responds via WhatsApp

**Expected Result:**
- Inquiry routed through WhatsApp
- Response synced back to platform
- Chat history maintained in platform

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-INQ-003: Inquiry — Empty Message

**Steps:**
1. Buyer clicks "Send Inquiry"
2. Leaves message empty
3. Clicks "Send"

**Expected Result:**
- Validation error: "Please enter a message"
- Inquiry not sent

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-INQ-004: Inquiry — Invalid Quantity

**Steps:**
1. Buyer clicks "Send Inquiry"
2. Enter quantity: `-5` or `abc`
3. Clicks "Send"

**Expected Result:**
- Validation error on quantity field
- Inquiry not sent

**Status:** ⬜ Pass ⬜ Fail

---

### 8.2 Chat System

#### TEST-CHAT-001: Open Chat Widget

**Precondition:** Logged in

**Steps:**
1. Click chat icon (floating button or in navbar)

**Expected Result:**
- Chat widget opens
- Message input field visible
- Send button visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-CHAT-002: Send Chat Message

**Steps:**
1. Open chat
2. Type: `Hello, I'm interested in your product`
3. Click "Send" or press Enter

**Expected Result:**
- Message appears in chat window
- Message shows on right side (sent)
- Timestamp visible
- Input field clears

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-CHAT-003: Chat — Empty Message

**Steps:**
1. Open chat
2. Leave input empty
3. Click "Send"

**Expected Result:**
- Message not sent
- No empty message in chat

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-CHAT-004: Chat — AI Translator Toggle

**Steps:**
1. Open chat
2. Enable AI Translator toggle
3. Select target language: `Indonesian`
4. Type message in English
5. Send

**Expected Result:**
- Message auto-translated to Indonesian
- Original and translated text both visible
- Recipient sees translated message

**Status:** ⬜ Pass ⬜ Fail

---

## 9. Leaderboard & Gamification

#### TEST-LEAD-001: View Leaderboard

**Precondition:** Multiple suppliers with activity data

**Steps:**
1. Navigate to `/dashboard/leaderboard`

**Expected Result:**
- Rankings display correctly
- Top 3 have medal indicators (🥇🥈🥉)
- Each entry shows: rank, company name, score, trend arrow
- Progress bars render
- Current user's position highlighted

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-LEAD-002: Leaderboard — My Score Card

**Steps:**
1. View leaderboard
2. Find "My Score" card

**Expected Result:**
- Shows current user's rank
- Shows current score
- Shows score breakdown (conversion rate, repeat buyers, response rate)
- Shows trend (up/down)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-LEAD-003: Leaderboard — Score Updates After Conversion

**Precondition:** Supplier has a converted inquiry

**Steps:**
1. Note current leaderboard score
2. Mark an inquiry as "Converted"
3. Refresh leaderboard

**Expected Result:**
- Score increases
- Rank may improve
- Conversion rate metric updated

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-LEAD-004: Leaderboard — Anti-Spam Validation

**Precondition:** Supplier tries to game the system

**Steps:**
1. Create many low-quality inquiries
2. Check leaderboard

**Expected Result:**
- Score does not inflate from spam
- Business metrics (conversion rate, repeat buyers) prevent gaming
- Leaderboard reflects real business value

**Status:** ⬜ Pass ⬜ Fail

---

## 10. Settings & Profile Management

#### TEST-SET-001: View Settings Page

**Steps:**
1. Navigate to `/dashboard/settings`

**Expected Result:**
- Settings page loads
- Tabs visible: Company, Account, Notifications, Security, Billing
- Current tab content displays

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-002: Update Company Profile

**Steps:**
1. Navigate to Settings → Company tab
2. Update company name: `PT Grawizah Indonesia`
3. Update address: `Jakarta, Indonesia`
4. Update phone: `+62-21-1234567`
5. Click "Save"

**Expected Result:**
- Success message displayed
- Changes saved to database
- Updated info visible on reload

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-003: Update Account Settings

**Steps:**
1. Navigate to Settings → Account tab
2. Update display name
3. Click "Save"

**Expected Result:**
- Name updated
- Changes reflected in navbar

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-004: Notification Toggles

**Steps:**
1. Navigate to Settings → Notifications tab
2. Toggle email notifications on/off
3. Toggle push notifications on/off

**Expected Result:**
- Toggles save correctly
- State persists on reload

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-005: Security — Change Password

**Steps:**
1. Navigate to Settings → Security tab
2. Enter current password: `TestPass123!`
3. Enter new password: `NewPass456!`
4. Confirm new password: `NewPass456!`
5. Click "Change Password"

**Expected Result:**
- Success message displayed
- Can login with new password
- Cannot login with old password

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-006: Security — Wrong Current Password

**Steps:**
1. Navigate to Settings → Security tab
2. Enter current password: `WrongPassword`
3. Enter new password: `NewPass456!`
4. Click "Change Password"

**Expected Result:**
- Error: "Current password is incorrect"
- Password not changed

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SET-007: Billing Information Display

**Precondition:** Logged in as premium user

**Steps:**
1. Navigate to Settings → Billing tab

**Expected Result:**
- Current plan displayed (Premium Intelligence)
- Billing history visible
- Payment method visible
- Upgrade/downgrade options (if applicable)

**Status:** ⬜ Pass ⬜ Fail

---

## 11. Security & Access Control

#### TEST-SEC-001: Supplier Cannot Access Buyer Routes

**Precondition:** Logged in as supplier

**Steps:**
1. Try to navigate to buyer-specific pages:
   - `/dashboard/rfq`
   - `/dashboard/documents`

**Expected Result:**
- Access denied or redirect to supplier dashboard
- No buyer data visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-002: Buyer Cannot Access Supplier Routes

**Precondition:** Logged in as buyer

**Steps:**
1. Try to navigate to supplier-specific pages:
   - `/dashboard/catalog` (supplier's own products)
   - `/dashboard/inquiries` (supplier's inquiry management)

**Expected Result:**
- Access denied or redirect to buyer dashboard
- No supplier management features visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-003: Token — Tampered Token

**Precondition:** Logged in

**Steps:**
1. Open DevTools → Application → LocalStorage
2. Modify the Supabase access token (change a character)
3. Navigate to any protected page (or make an API call with the tampered token)

**Expected Result:**
- Request rejected (401) — `AuthMiddleware` validates JWT signature
- Redirected to login
- No data leaked

> **Note:** This test is only meaningful for routes that have `AuthMiddleware()` applied. Currently, only routes behind `AuthMiddleware` or `AIRateLimitMiddleware` validate tokens. Product, buyer, and inquiry routes do not (see BUG-004/005/006).

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-004: Token — Expired Token

**Steps:**
1. Login and get a valid Supabase access token
2. Wait for token expiry (Supabase default is 1 hour) or manually decode the JWT, modify the `exp` claim, and re-encode with a wrong signature
3. Make an API request with the expired token

**Expected Result:**
- 401 Unauthorized response — `AuthMiddleware` validates token expiry via `jwt.Parse`
- User prompted to re-login
- **Note:** No refresh token endpoint is currently implemented (see BUG-012). User must login again.

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-005: SQL Injection Prevention

**Steps:**
1. In any text input, enter: `' OR 1=1 --`
2. Submit the form

**Expected Result:**
- Input sanitized
- No database error
- No unauthorized data access

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-006: XSS Prevention

**Steps:**
1. In any text input, enter: `<script>alert('XSS')</script>`
2. Submit the form
3. View the submitted content

**Expected Result:**
- Script is not executed
- Content displayed as plain text (escaped)
- No alert box appears

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-007: API — Unauthenticated Request to Protected Routes

**Steps:**
1. Without logging in, make API calls to various endpoints:
```bash
curl http://localhost:8080/api/products
curl http://localhost:8080/api/buyers/radar
curl http://localhost:8080/api/leaderboard
curl -X POST http://localhost:8080/api/ai/hs-code -H "Content-Type: application/json" -d '{"description":"palm oil"}'
```

**Expected Result:**
- `/api/products` → **200** (⚠️ Known issue: no auth middleware on product routes)
- `/api/buyers/radar` → **200** (⚠️ Known issue: no auth middleware on buyer routes)
- `/api/leaderboard` → **200** (public endpoint, no auth required — this is correct)
- `/api/ai/hs-code` → **401** (AIRateLimitMiddleware blocks unauthenticated requests)

> **Note:** The AI routes are the only endpoints that properly reject unauthenticated requests. Product, buyer, inquiry, and other routes need `AuthMiddleware()` added. See Known Issues section.

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-008: CORS — Cross-Origin Request

**Steps:**
1. Make API request from a different origin:
```bash
curl -H "Origin: http://evil.com" http://localhost:8080/health
```

**Expected Result:**
- CORS headers present (`Access-Control-Allow-Origin: *`)
- ⚠️ **Known Issue:** The current CORS middleware allows ALL origins (`*`). This is acceptable for development but should be restricted to specific origins in production (e.g., `https://grawizah.com`).

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-SEC-009: Document Vault — RLS Enforcement

**Precondition:** Two buyer accounts (Buyer A and Buyer B)

**Steps:**
1. As Buyer A: Upload a document
2. As Buyer B: Try to access Buyer A's document (via API or UI)

**Expected Result:**
- Buyer B cannot see Buyer A's documents
- RLS policy enforced at database level
- 403 Forbidden or empty result

**Status:** ⬜ Pass ⬜ Fail

---

## 12. UI/UX & Responsiveness

#### TEST-UI-001: Dark Mode Toggle

**Steps:**
1. Click dark/light mode toggle in navbar
2. Navigate through multiple pages

**Expected Result:**
- Theme switches immediately
- All pages respect the theme
- Theme persists on page refresh
- No flash of wrong theme

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-002: Dark Mode — All Pages Consistent

**Steps:**
1. Enable dark mode
2. Visit: Landing, Login, Register, Dashboard, Catalog, Inquiries, Intelligence, Leaderboard, Settings

**Expected Result:**
- All pages render correctly in dark mode
- No white backgrounds where there shouldn't be
- Text is readable (sufficient contrast)
- Images and icons visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-003: Mobile Responsiveness — Dashboard

**Steps:**
1. Open DevTools → Toggle device toolbar
2. Select iPhone 12 Pro (390x844)
3. Navigate to `/dashboard`

**Expected Result:**
- No horizontal scroll
- Sidebar collapses to hamburger menu
- Stats cards stack vertically
- Tables scroll horizontally or stack
- All buttons are tap-friendly (min 44px touch target)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-004: Mobile Responsiveness — Landing Page

**Steps:**
1. Set viewport to mobile (375x667)
2. Navigate to `/`

**Expected Result:**
- Hero section scales properly
- Text is readable without zooming
- CTA buttons are full-width or properly sized
- Navigation collapses to hamburger menu
- No overflow or layout breaks

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-005: Tablet Responsiveness

**Steps:**
1. Set viewport to iPad (768x1024)
2. Navigate through all pages

**Expected Result:**
- Layout adapts to tablet size
- Sidebar may be collapsed or visible
- Content uses available space well
- No layout breaks

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-006: Loading States

**Steps:**
1. Navigate to any data-heavy page (dashboard, catalog, leaderboard)
2. Observe during data load

**Expected Result:**
- Loading spinner/skeleton shown while data loads
- No blank white screen
- Content appears smoothly after load
- No layout shift (CLS)

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-007: Error States — Network Error

**Steps:**
1. Stop the backend server
2. Try to load dashboard

**Expected Result:**
- User-friendly error message displayed
- "Unable to connect" or similar message
- Retry button offered
- No raw error stack trace visible

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-008: Form Validation Visual Feedback

**Steps:**
1. Go to any form (register, login, add product)
2. Submit with invalid data

**Expected Result:**
- Invalid fields highlighted in red
- Error messages appear below fields
- Valid fields show green indicator (optional)
- Form scrolls to first error

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-009: Animations & Transitions

**Steps:**
1. Navigate through the app
2. Observe page transitions, hover effects, button clicks

**Expected Result:**
- Smooth transitions (no janky animations)
- Hover effects on interactive elements
- Button press feedback
- No animation performance issues

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-010: Accessibility — Keyboard Navigation

**Steps:**
1. Navigate the entire app using only Tab, Shift+Tab, Enter, Escape

**Expected Result:**
- All interactive elements are focusable
- Focus indicator visible
- Tab order is logical
- Dropdowns open with Enter/Space
- Modals close with Escape

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-UI-011: Accessibility — Screen Reader

**Steps:**
1. Enable screen reader (NVDA/VoiceOver)
2. Navigate through key pages

**Expected Result:**
- Images have alt text
- Form fields have labels
- Buttons have descriptive text
- ARIA labels present on icon-only buttons
- Page structure uses semantic HTML

**Status:** ⬜ Pass ⬜ Fail

---

## 13. Error Handling & Edge Cases

#### TEST-ERR-001: 404 Page

**Steps:**
1. Navigate to `http://localhost:3000/nonexistent-page`

**Expected Result:**
- Custom 404 page displayed
- "Page not found" message
- Link back to home page
- No raw error or stack trace

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-002: API — 500 Error Handling

**Precondition:** Simulate a server error

**Steps:**
1. Trigger an API endpoint that causes a server error
2. Observe frontend behavior

**Expected Result:**
- Frontend catches error gracefully
- User-friendly message displayed
- No app crash
- Retry option available

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-003: AI Service — Groq API Unavailable

**Precondition:** Groq API key invalid or service down

**Steps:**
1. Try to use any AI feature (HS Code, Translator, etc.)

**Expected Result:**
- Error message: "AI service temporarily unavailable"
- Fallback behavior (if implemented)
- No app crash
- User can retry

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-004: Database Connection Lost

**Precondition:** Stop the database

**Steps:**
1. Try to load any data-dependent page

**Expected Result:**
- Error message displayed
- No sensitive error details leaked
- Graceful degradation

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-005: Concurrent Edit Conflict

**Steps:**
1. Open product edit in two browser tabs
2. Edit and save in tab 1
3. Edit and save in tab 2

**Expected Result:**
- Second save shows conflict warning or overwrites (document expected behavior)
- No data corruption
- No crash

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-006: Very Long Input

**Steps:**
1. In any text field, paste 10,000+ characters
2. Submit

**Expected Result:**
- Input truncated or rejected with clear message
- No crash
- Database handles it gracefully

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-007: Special Characters in Input

**Steps:**
1. In product name, enter: `<script>alert(1)</script> & "quotes" 'single'`
2. Save

**Expected Result:**
- Special characters handled correctly
- No XSS execution
- Data stored and displayed correctly

**Status:** ⬜ Pass ⬜ Fail

---

#### TEST-ERR-008: Simultaneous Login from Multiple Devices

**Steps:**
1. Login as same user on two different browsers
2. Perform actions on both

**Expected Result:**
- Both sessions work (or second invalidates first — document behavior)
- No data corruption
- Consistent state

**Status:** ⬜ Pass ⬜ Fail

---

## 14. API Endpoint Testing

> **Base URL:** `http://localhost:8080`
>
> **Auth:** All endpoints except `/health`, `/api/auth/*`, and `/api/products` (GET) require a valid Supabase JWT in the `Authorization: Bearer <token>` header. Obtain a token by calling `POST /api/auth/login` first.
>
> **⚠️ Known Issue:** Product CRUD routes (`POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`) and inquiry routes currently have **no auth middleware** applied. This is a security gap — see Known Issues section.

### 14.1 Health & Base

| Test ID | Method | Endpoint | Expected Status | Expected Response |
|---------|--------|----------|-----------------|-------------------|
| API-001 | GET | `/health` | 200 | `{"status": "healthy", "service": "grawizah-api", "version": "1.0.0"}` |
| API-002 | GET | `/api/products` | 200 | Product list (no auth currently required — see Known Issues) |

### 14.2 Authentication

| Test ID | Method | Endpoint | Body | Expected Status |
|---------|--------|----------|------|-----------------|
| API-003 | POST | `/api/auth/register` | `{"email":"new@test.com","password":"TestPass123!","full_name":"Test User","role":"free_trader"}` | 200 |
| API-004 | POST | `/api/auth/register` | Duplicate email | 400 |
| API-005 | POST | `/api/auth/register` | Invalid email format | 400 |
| API-006 | POST | `/api/auth/login` | `{"email":"...","password":"..."}` (valid) | 200 + `{"token": "...", "user": {...}}` |
| API-007 | POST | `/api/auth/login` | Wrong password | 401 |
| ~~API-008~~ | ~~POST~~ | ~~`/api/auth/refresh`~~ | — | **⚠️ Endpoint does not exist** — remove this test |

### 14.3 Products

| Test ID | Method | Endpoint | Auth | Expected Status | Notes |
|---------|--------|----------|------|-----------------|-------|
| API-009 | GET | `/api/products` | None (currently) | 200 | ⚠️ No auth required — known issue |
| API-010 | GET | `/api/products/:id` | None (currently) | 200 | ⚠️ No auth required — known issue |
| API-011 | POST | `/api/products` | None (currently) | 201 | ⚠️ No auth required — known issue |
| API-012 | PUT | `/api/products/:id` | None (currently) | 200 | ⚠️ No auth required — known issue |
| API-013 | DELETE | `/api/products/:id` | None (currently) | 200 (soft delete) | ⚠️ No auth required — known issue |
| API-014 | DELETE | `/api/products/:id` | None (currently) | 200 | ⚠️ No ownership check — known issue |
| API-015 | POST | `/api/products/search` | None | 200 | Body: `{"query": "palm oil"}` |
| API-016 | POST | `/api/products/:id/view` | None | 200 | Increments view_count |

### 14.4 Buyers

| Test ID | Method | Endpoint | Auth | Expected Status | Notes |
|---------|--------|----------|------|-----------------|-------|
| API-017 | GET | `/api/buyers/radar` | None (currently) | 200 | ⚠️ Known bug: fails if `buyers` table missing columns |
| API-018 | GET | `/api/buyers/:id` | None (currently) | 200 | ⚠️ Same schema issue |
| API-019 | POST | `/api/buyers/search` | None | 200 | Body: `{"query": "palm"}` |
| API-020 | POST | `/api/buyers/:id/lead-score` | None | 200 | Body: `{"product_category": "Agriculture"}` |

### 14.5 AI Endpoints

> **Note:** All AI endpoints are under `/api/ai` and use `AIRateLimitMiddleware()`. This middleware checks for `user_role` in the Gin context but does **not** enforce JWT authentication first. Unauthenticated requests will receive a `401` from the rate limiter. Premium users (`premium_trader`) bypass the rate limit.

| Test ID | Method | Endpoint | Auth | Expected Status | Expected Response |
|---------|--------|----------|------|-----------------|-------------------|
| API-021 | POST | `/api/ai/hs-code` | Free (under limit) | 200 | `{"success": true, "data": {"hs_code": "...", "confidence": ...}}` |
| API-022 | POST | `/api/ai/hs-code` | Free (over limit) | 429 | Rate limit error |
| API-023 | POST | `/api/ai/hs-code` | Premium | 200 | HS code + confidence |
| API-024 | POST | `/api/ai/translate` | Any auth | 200 | `{"translatedText": "...", "targetLang": "..."}` |
| API-025 | POST | `/api/ai/detect-language` | Any auth | 200 | `{"language": "auto", "confidence": 1.0}` |
| API-026 | POST | `/api/ai/optimize-listing` | Supplier | 200 | Score + suggestions |
| API-027 | POST | `/api/ai/response-suggestion` | Supplier | 200 | `{"success": true, "data": {"suggested_response": "..."}}` |

### 14.6 Inquiries

> **Note:** Inquiry routes have **no auth middleware** applied. The routes use path parameters (`supplier/:id`, `buyer/:id`) rather than a base GET endpoint.

| Test ID | Method | Endpoint | Auth | Expected Status | Notes |
|---------|--------|----------|------|-----------------|-------|
| ~~API-028~~ | ~~GET~~ | ~~`/api/inquiries`~~ | — | **⚠️ Endpoint does not exist** — returns 404 | Remove this test |
| API-028 | GET | `/api/inquiries/supplier/:id` | None (currently) | 200 | List inquiries for a supplier |
| API-029 | GET | `/api/inquiries/buyer/:id` | None (currently) | 200 | List inquiries for a buyer |
| API-030 | POST | `/api/inquiries` | None (currently) | 201 | Body: `{"buyer_id": "...", "supplier_id": "...", "product_id": "...", "message": "..."}` |
| API-031 | PUT | `/api/inquiries/:id/respond` | None (currently) | 200 | Body: `{"message": "..."}` |
| API-032 | PUT | `/api/inquiries/:id/convert` | None (currently) | 200 | Marks inquiry as converted |
| API-033 | GET | `/api/inquiries/analytics/:supplier_id` | None (currently) | 200 | Inquiry analytics for supplier |

### 14.7 Leaderboard

| Test ID | Method | Endpoint | Auth | Expected Status | Notes |
|---------|--------|----------|------|-----------------|-------|
| API-034 | GET | `/api/leaderboard` | None | 200 | ⚠️ Known bug: may fail if `companies` table JOIN fails |
| API-035 | GET | `/api/leaderboard/company/:id` | None | 200 | Company-specific rank |
| ~~API-036~~ | ~~GET~~ | ~~`/api/leaderboard/me`~~ | — | **⚠️ Endpoint does not exist** — returns 404 | Remove this test |

### 14.8 Rate Limiting

| Test ID | Method | Endpoint | Auth | Expected Status |
|---------|--------|----------|------|-----------------|
| API-036 | POST | `/api/ai/hs-code` (4th call) | Free | 429 |
| API-037 | POST | `/api/ai/hs-code` (4th call) | Premium | 200 |

### 14.9 Additional Endpoints (Not Previously Listed)

| Test ID | Method | Endpoint | Auth | Expected Status | Notes |
|---------|--------|----------|------|-----------------|-------|
| API-038 | GET | `/api/companies/:id` | None | 200 | Get company by ID |
| API-039 | GET | `/api/companies/me` | None | 200 | Get current user's company |
| API-040 | GET | `/api/competitor/benchmark` | None | 200 | Competitor benchmarking data |
| API-041 | GET | `/api/buyers/:id/quality-score` | None | 200 | Buyer quality score |
| API-042 | GET | `/api/alerts/market` | None | 200 | Market alerts |
| API-043 | POST | `/api/chat/send` | None | 200 | Send chat message |
| API-044 | GET | `/api/chat/history/:supplier_id` | None | 200 | Chat history |
| API-045 | POST | `/api/whatsapp/send` | None | 200 | Send WhatsApp message |
| API-046 | POST | `/api/whatsapp/webhook` | None | 200 | WhatsApp webhook receiver |

---

## 15. Known Issues & Bugs

> **Last Updated:** May 15, 2026
> This section documents known bugs and gaps discovered during code review and live testing. Tests referencing these issues are marked with ⚠️ in the test cases above.

### 15.1 Critical — Database Schema Mismatches

| ID | Issue | Affected Endpoints | Root Cause |
|----|-------|-------------------|------------|
| **BUG-001** | `GET /api/products` returns SQL scan error | `/api/products`, `/api/products/:id`, `/api/products/search` | `Product.Images` is `[]string` in Go model but `TEXT[]` in PostgreSQL. `database/sql` + `lib/pq` cannot auto-scan `TEXT[]` → `[]string`. **Fix:** Use `pq.Array(&p.Images)` in all Scan calls in `product_repo.go` |
| **BUG-002** | `GET /api/buyers/radar` returns "column import_volume does not exist" | `/api/buyers/radar`, `/api/buyers/:id`, `/api/buyers/search`, `/api/buyers/:id/lead-score` | The `buyers` table schema is missing 6 columns that the Go model expects: `import_volume`, `import_value`, `hs_codes`, `contact_email`, `contact_phone`, `website`. **Fix:** Either add columns to schema or remove fields from model/repository |
| **BUG-003** | `GET /api/leaderboard` returns "Failed to fetch leaderboard" | `/api/leaderboard`, `/api/leaderboard/company/:id` | `leaderboard_repo.go` `GetAll()` JOINs with `companies` table and selects `c.name as company_name`, but `GetByCompanyID()` does NOT do a JOIN yet still scans for `CompanyName`/`Country` fields. **Fix:** Add JOIN to `GetByCompanyID()` or remove extra fields from Scan |

### 15.2 Critical — Missing Auth Middleware

| ID | Issue | Affected Routes | Risk |
|----|-------|-----------------|------|
| **BUG-004** | Product CRUD routes have no auth middleware | `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` | Any unauthenticated user can create, modify, or delete any product |
| **BUG-005** | Inquiry routes have no auth middleware | All `/api/inquiries/*` routes | Any unauthenticated user to view, create, respond to, or convert inquiries |
| **BUG-006** | Buyer routes have no auth middleware | All `/api/buyers/*` routes | Any unauthenticated user can access buyer data and lead scoring |
| **BUG-007** | AI routes use `AIRateLimitMiddleware` without `AuthMiddleware` | All `/api/ai/*` routes | The rate limiter checks `user_role` from Gin context but never validates the JWT first. **Fix:** Add `AuthMiddleware()` before `AIRateLimitMiddleware()` in the route group |

### 15.3 High — Auth/Login Issues

| ID | Issue | Details |
|----|-------|---------|
| **BUG-008** | Registration returns "Email address is invalid" for valid emails | Supabase Auth service is rejecting emails. Check: (1) `SUPABASE_SERVICE_ROLE_KEY` is correct in `.env`, (2) Supabase project has email validation settings configured, (3) Supabase project is active |
| **BUG-009** | Login returns `{"error": null}` with no token | Supabase auth response parsing issue. The `error_description` field may not be present in the error response. **Fix:** Check the actual Supabase error response format and handle all error fields |

### 15.4 Medium — Missing Routes

| ID | Issue | Details |
|----|-------|---------|
| **BUG-010** | `GET /api/inquiries` returns 404 | No base inquiry list route exists. Only `/api/inquiries/supplier/:id` and `/api/inquiries/buyer/:id` are defined |
| **BUG-011** | `GET /api/leaderboard/me` returns 404 | No `/api/leaderboard/me` route exists. Only `/api/leaderboard` and `/api/leaderboard/company/:id` are defined |
| **BUG-012** | `POST /api/auth/refresh` returns 404 | No refresh token endpoint is implemented |

### 15.5 Test Guide Discrepancies Fixed

| ID | Original Guide | Corrected To | Reason |
|----|---------------|-------------|--------|
| **FIX-001** | Role: `supplier` | Role: `free_trader` / `premium_trader` | Database enum is `'guest', 'free_trader', 'premium_trader', 'buyer', 'admin'` |
| **FIX-002** | `POST /api/auth/register` → 201 | `POST /api/auth/register` → 200 | Backend returns 200, not 201 |
| **FIX-003** | `POST /api/auth/register` duplicate → 409 | `POST /api/auth/register` duplicate → 400 | Supabase returns 400 |
| **FIX-004** | `GET /api/products` → 401 (no auth) | `GET /api/products` → 200 (no auth) | No auth middleware on product routes (BUG-004) |
| **FIX-005** | `GET /api/inquiries` exists | `GET /api/inquiries` → 404 | Route doesn't exist (BUG-010) |
| **FIX-006** | `GET /api/leaderboard/me` exists | `GET /api/leaderboard/me` → 404 | Route doesn't exist (BUG-011) |
| **FIX-007** | `POST /api/auth/refresh` exists | `POST /api/auth/refresh` → 404 | Route doesn't exist (BUG-012) |
| **FIX-008** | JWT token terminology | Supabase access token | Backend returns Supabase JWT, not a custom JWT |

---

## 16. Test Result Documentation Template

Use this template to document test results:

```
========================================
TEST RESULT REPORT
========================================
Date: YYYY-MM-DD
Tester Name: _______________
Environment: Local / Staging / Production
Browser: Chrome / Firefox / Safari / Edge
Viewport: Desktop (1920x1080) / Tablet (768x1024) / Mobile (375x667)
Backend URL: http://localhost:8080
Frontend URL: http://localhost:3000

----------------------------------------
SUMMARY
----------------------------------------
Total Tests: ___
Passed: ___
Failed: ___
Skipped: ___
Pass Rate: ___%

----------------------------------------
FAILED TESTS
----------------------------------------
Test ID: _______
Description: _______
Steps to Reproduce:
  1.
  2.
  3.
Expected Result: _______
Actual Result: _______
Severity: Critical / High / Medium / Low
Screenshot: [attach]
Console Errors: [paste]

----------------------------------------
CRITICAL ISSUES (Must fix before submission)
----------------------------------------
1. _______
2. _______

----------------------------------------
RECOMMENDATIONS
----------------------------------------
1. _______
2. _______

========================================
SIGN-OFF
========================================
QA Lead: _______
Date: _______
Status: ✅ Ready for Submission / ❌ Needs Fixes
```

---

## Quick Reference: Test Priority Matrix

| Priority | Tests | Must Pass Before Submission |
|----------|-------|---------------------------|
| **P0 — Critical** | Auth (001-008), Product CRUD (003-005), Inquiry Flow (001), AI HS Code (001), Security (001-004) | ✅ Yes — but see Known Issues (Section 15) for current blockers |
| **P1 — High** | Dashboard (001-002), AI Features (006-011), Leaderboard (001-003), Settings (001-005) | ✅ Yes |
| **P2 — Medium** | Chat (001-004), Document Vault (001-004), Competitor Benchmark (001-002), UI (001-006) | 🔶 Best effort |
| **P3 — Low** | Market Alerts (001-002), Edge Cases (005-008), Accessibility (001-001) | 🔶 Best effort |

### P0 Blocker Summary (From Known Issues)

The following bugs must be fixed before P0 tests can pass:

| Bug | Impact | Fix |
|-----|--------|-----|
| BUG-001 | Product endpoints return SQL errors | Add `pq.Array()` wrappers in `product_repo.go` |
| BUG-002 | Buyer endpoints fail — missing DB columns | Add missing columns to `buyers` table or remove from model |
| BUG-003 | Leaderboard fails — JOIN/Scan mismatch | Fix `GetByCompanyID` in `leaderboard_repo.go` |
| BUG-008 | Registration fails — Supabase config | Verify Supabase service role key and project settings |
| BUG-009 | Login returns null error | Fix Supabase error response parsing in `auth_handler.go` |

---

**Document Version:** 1.1.0
**Last Updated:** May 15, 2026
**Author:** Praisilia — PM, Team Successful Failures
**Reviewers:** Wisnu (Backend), Reza (Frontend)
**Changelog:**
- v1.1.0 — Aligned all test expectations with actual backend implementation
  - Fixed role names: `supplier` → `free_trader`/`premium_trader`
  - Fixed API response codes: register returns 200 (not 201), duplicate returns 400 (not 409)
  - Removed non-existent endpoints: `/api/auth/refresh`, `/api/inquiries` (base), `/api/leaderboard/me`
  - Added missing endpoints: `/api/products/search`, `/api/products/:id/view`, `/api/companies/*`, `/api/chat/*`, `/api/whatsapp/*`, `/api/competitor/benchmark`, `/api/buyers/:id/quality-score`, `/api/alerts/market`
  - Updated auth terminology: "JWT token" → "Supabase access token"
  - Updated SEC-007 to reflect actual auth state of each endpoint group
  - Added Section 15: Known Issues & Bugs (BUG-001 through BUG-012, FIX-001 through FIX-008)
  - Added P0 Blocker Summary to Priority Matrix
