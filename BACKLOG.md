# Grawizah — Project Backlog & Sprint Log

> **Competition:** TechSprint Innovation Cup 2026  
> **Team:** Successful Failures — From Error to Impact | President University  
> **Project Start:** May 1, 2026 (Initial Commit)  
> **Submission Deadline:** May 17, 2026  

---

## Project Timeline Overview

```
May 1 ──────── May 7 ──────── May 14 ──────── May 17
   |               |               |               |
[Sprint 1]    [Sprint 2]     [Sprint 3]      [DEADLINE]
Foundation    Core Features  Polish & Docs   Submission
```

---

## Sprint 1 — Foundation & Architecture
**Duration:** May 1 – May 7, 2026  
**Focus:** Project scaffolding, authentication, database schema, core API structure

### Completed

| ID | Task | Owner | Status |
| :-- | :--- | :--- | :--- |
| BE-001 | Initialize Go backend with clean architecture (handlers, services, repositories, interfaces) | Wisnu | Done |
| BE-002 | Implement PostgreSQL connection pool with `lib/pq` | Wisnu | Done |
| BE-003 | Create User model with role-based field (`supplier` / `buyer`) | Wisnu | Done |
| BE-004 | Implement JWT authentication (login, register, token refresh) | Wisnu | Done |
| BE-005 | Implement bcrypt password hashing | Wisnu | Done |
| BE-006 | Create JWT middleware for protected routes | Wisnu | Done |
| BE-007 | Implement rate limiting middleware (per-role tiers) | Wisnu | Done |
| BE-008 | Create Company model and repository | Wisnu | Done |
| BE-009 | Create Product model and CRUD endpoints | Wisnu | Done |
| BE-010 | Create Inquiry model with polymorphic source type | Wisnu | Done |
| BE-011 | Implement `GetBySupplierID` with buyer/product JOIN | Wisnu | Done |
| BE-012 | Database migrations (SQL schema for all tables) | Wisnu | Done |
| FE-001 | Initialize Next.js 14 project (App Router, TypeScript) | Reza | Done |
| FE-002 | Configure Tailwind CSS with custom design tokens | Reza | Done |
| FE-003 | Build global CSS system (dark/light mode variables) | Reza | Done |
| FE-004 | Build landing page (hero, features, CTA) | Reza | Done |
| FE-005 | Implement `useAuth` hook with JWT token management | Reza | Done |
| FE-006 | Build Navbar component (theme-adaptive, blur effect) | Reza | Done |
| PM-001 | Define feature requirements and user stories | Praisilia | Done |
| PM-002 | Create initial project timeline and milestone plan | Praisilia | Done |
| PM-003 | Define Buyer and Supplier persona and journey maps | Praisilia | Done |

---

## Sprint 2 — Core Features & AI Integration
**Duration:** May 8 – May 12, 2026  
**Focus:** Role-based dashboards, AI modules, data flows, real API integration

### Completed

| ID | Task | Owner | Status |
| :-- | :--- | :--- | :--- |
| BE-013 | Integrate Groq Llama 3.1 for HS Code classification | Wisnu | Done |
| BE-014 | Build `/api/ai/hs-code` endpoint with confidence scoring | Wisnu | Done |
| BE-015 | Build `/api/ai/translate` with 14-language support | Wisnu | Done |
| BE-016 | Build `/api/ai/detect-language` endpoint | Wisnu | Done |
| BE-017 | Build `/api/ai/optimize-listing` scoring endpoint | Wisnu | Done |
| BE-018 | Build `/api/competitor/benchmark` price aggregation | Wisnu | Done |
| BE-019 | Implement Buyer repository (`GetByBuyerID`, `GetByBuyerIDWithDetails`) | Wisnu | Done |
| BE-020 | Implement Inquiry analytics (`CalculateAnalytics`) | Wisnu | Done |
| BE-021 | Fix type mismatch: convert `[]InquiryDetail` to `[]Inquiry` in `GetAnalytics` | Wisnu | Done |
| BE-022 | Implement Leaderboard service for supplier ranking | Wisnu | Done |
| BE-023 | Implement Buyer service layer | Wisnu | Done |
| BE-024 | Implement Company handler for RBAC-protected endpoints | Wisnu | Done |
| FE-007 | Build role-aware Dashboard (`/dashboard`) — Supplier vs Buyer views | Reza | Done |
| FE-008 | Build Supplier dashboard stats (orders, inquiries, intelligence score) | Reza | Done |
| FE-009 | Build Buyer dashboard stats (RFQs, verified sources, savings) | Reza | Done |
| FE-010 | Build Trade Intelligence page (`/dashboard/intelligence`) | Reza | Done |
| FE-011 | Implement role-specific tab sets (Supplier vs Buyer tabs) | Reza | Done |
| FE-012 | Build `TradeNetworkMap` — interactive node-graph visualization | Reza | Done |
| FE-013 | Build `BuyerRadarTable` — live buyer demand stream | Reza | Done |
| FE-014 | Build AI Smart Matchmaker UI with role-specific content | Reza | Done |
| FE-015 | Build HS Code Classifier UI with result display | Reza | Done |
| FE-016 | Build Price Benchmark UI with bar chart visualization | Reza | Done |
| FE-017 | Build Multilingual Translator UI (14 languages) | Reza | Done |
| FE-018 | Build Catalog page (`/dashboard/catalog`) | Reza | Done |
| FE-019 | Build Inquiries page (`/dashboard/inquiries`) | Reza | Done |
| FE-020 | Build Settings page (`/dashboard/settings`) | Reza | Done |
| FE-021 | Build Leaderboard page (`/dashboard/leaderboard`) | Reza | Done |
| FE-022 | Build Dashboard Sidebar with role-specific navigation links | Reza | Done |
| PM-004 | Conduct user flow walkthrough (Supplier journey end-to-end) | Praisilia | Done |
| PM-005 | Conduct user flow walkthrough (Buyer journey end-to-end) | Praisilia | Done |
| PM-006 | Document API contracts for all AI endpoints | Praisilia | Done |

---

## Sprint 3 — UI Polish, Documentation & Competition Prep
**Duration:** May 13 – May 14, 2026  
**Focus:** Visual consistency, security hardening, competition documentation

### Completed

| ID | Task | Owner | Status |
| :-- | :--- | :--- | :--- |
| FE-023 | Apply Vercel-inspired minimalist aesthetic across all pages | Reza | Done |
| FE-024 | Ensure full Light / Dark mode consistency on all pages | Reza | Done |
| FE-025 | Add floating dynamic background orbs to landing page | Reza | Done |
| FE-026 | Polish Intelligence page tab UI (boxy, uppercase, scale-on-active) | Reza | Done |
| FE-027 | Fix `useAuth` missing import in `intelligence/page.tsx` | Reza | Done |
| FE-028 | Fix duplicate closing tags in `dashboard/page.tsx` | Reza | Done |
| BE-025 | Security: remove `.qwen/` tool files from git tracking | Wisnu | Done |
| BE-026 | Security: update `.gitignore` (add `.qwen/`, `*.key`, `credentials.json`) | Wisnu | Done |
| BE-027 | Security: commit security cleanup | Wisnu | Done |
| DOC-001 | Rewrite README.md — full competition-grade documentation | Praisilia | Done |
| DOC-002 | Add all system diagrams (Use Case, Flow, Sequence, Class) in Mermaid | Praisilia | Done |
| DOC-003 | Fix broken `useCaseDiagram` syntax — replace with supported Mermaid `graph LR` | Praisilia | Done |
| DOC-004 | Add full API Reference table to README | Praisilia | Done |
| DOC-005 | Add Project Structure tree to README | Praisilia | Done |
| DOC-006 | Update LICENSE with team and institution info | Praisilia | Done |
| DOC-007 | Create `BACKLOG.md` (this file) with full sprint history | Praisilia | Done |
| DOC-008 | Remove all unnecessary emojis from README for professional presentation | Praisilia | Done |

---

## Sprint 4 — Final Submission Preparation
**Duration:** May 15 – May 17, 2026 (DEADLINE)  
**Focus:** End-to-end testing, final push, submission

### To Do

| ID | Task | Owner | Priority | Status |
| :-- | :--- | :--- | :--- | :--- |
| TEST-001 | Run full E2E user flow: Register → Login → Supplier Dashboard → Create Product → Match → Inquiry | All | CRITICAL | Open |
| TEST-002 | Run full E2E user flow: Register → Login → Buyer Dashboard → Discover → Benchmark → RFQ | All | CRITICAL | Open |
| TEST-003 | Test Dark/Light mode toggle across all pages on mobile viewport | Reza | High | Open |
| TEST-004 | Test all AI endpoints with real Groq API key (HS Code, Translate, Match) | Wisnu | High | Open |
| TEST-005 | Validate all JWT-protected routes reject unauthenticated requests | Wisnu | High | Open |
| TEST-006 | Verify no sensitive keys are exposed in public git history | Wisnu | CRITICAL | Open |
| BE-028 | Replace exposed Supabase and Groq API keys with new rotated keys | Wisnu | CRITICAL | Open |
| FE-029 | Final responsive check on tablet and mobile breakpoints | Reza | Medium | Open |
| DOC-009 | Final review of README diagrams render correctly on GitHub | Praisilia | High | Open |
| DOC-010 | Submit project to TechSprint Innovation Cup 2026 portal | Wisnu | CRITICAL | Open |

---

## Bug Tracker

| ID | Description | Severity | Status | Fixed In |
| :-- | :--- | :--- | :--- | :--- |
| BUG-001 | `Cannot find name 'useAuth'` in `intelligence/page.tsx` | Medium | Fixed | Sprint 3 |
| BUG-002 | Duplicate closing `}` tags in `dashboard/page.tsx` causing compile error | High | Fixed | Sprint 3 |
| BUG-003 | Type mismatch: `[]InquiryDetail` passed as `[]Inquiry` in `GetAnalytics` | High | Fixed | Sprint 3 |
| BUG-004 | `.qwen/` tool files committed and publicly visible on GitHub | Critical | Fixed | Sprint 3 |
| BUG-005 | `useCaseDiagram` Mermaid syntax not supported by GitHub — renders broken | Medium | Fixed | Sprint 3 |
| BUG-006 | `.env.local` containing live API keys was not excluded from git index | Critical | Mitigated | Sprint 3 |

---

## Velocity Summary

| Sprint | Tasks Completed | Story Points | Duration |
| :--- | :--- | :--- | :--- |
| Sprint 1 — Foundation | 21 tasks | 55 pts | May 1–7 |
| Sprint 2 — Core Features | 32 tasks | 89 pts | May 8–12 |
| Sprint 3 — Polish & Docs | 16 tasks | 34 pts | May 13–14 |
| Sprint 4 — Submission | 10 tasks | 25 pts | May 15–17 |
| **Total** | **79 tasks** | **203 pts** | **17 days** |

---

*Last updated: May 14, 2026 — Team Successful Failures, President University*
