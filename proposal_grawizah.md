# LAPORAN PENGEMBANGAN PROYEK

## GRAWIZAH
**Pre-Transaction Intelligence & Deal Orchestration Platform**

Versi Fitur: Basic + Premium Intelligence
Edisi Revisi — 2026
grawizah.com | Secure, Fast, & Intelligent Global Trade

---

## I. RINGKASAN EKSEKUTIF

Grawizah adalah Pre-Transaction Intelligence & Deal Orchestration Platform berbasis B2B yang menghubungkan supplier/trader lokal dengan pembeli global. Platform ini bukan sekadar direktori pasif — Grawizah membangun lapisan pre-transaksi yang cerdas: dari penemuan buyer, kualifikasi peluang, hingga fasilitasi komunikasi awal yang terstruktur.

Secara model, Grawizah bersifat non-transactional dalam pembayaran — tidak memproses uang atau deal finansial. Namun secara kapabilitas, Grawizah menyediakan full pre-transaction intelligence: RFQ Management, Buyer Radar, Supplier Comparison, Inquiry Orchestration, dan AI-powered insights — semua untuk mempersiapkan trader menang di meja negosiasi.

⚡ **Pembaruan Strategis**: Positioning diperbarui dari 'non-transactional directory' menjadi 'Pre-Transaction Intelligence & Deal Orchestration Layer'. Fitur Compliance Suite (Sanction Screening, Document OCR) telah resmi dihapus dari roadmap produk. Platform kini berfokus pada dua tier utama: Basic Intelligence dan Premium Intelligence.

**SATU ALUR TERINTEGRASI**
Data → Insight → Action → Result
Buyer Radar → Pilih Buyer → Kirim Inquiry → Track di Dashboard → Naik di Leaderboard

---

## II. VISI & MISI

**2.1 Visi**
Menjadi Pre-Transaction Intelligence Hub utama bagi eksportir menengah — menyediakan kapabilitas data, AI, dan deal orchestration setara perusahaan multinasional untuk UKM Indonesia yang bersaing di pasar global.

**2.2 Misi**
* **Transparansi Data** — Menyediakan akses buyer intelligence yang akurat, real-time, dan berbasis data trade aktual (UN Comtrade, customs data, riwayat impor) bagi trader premium.
* **AI-Powered Decision Loop** — Mengintegrasikan AI bukan hanya sebagai fitur tambahan, melainkan sebagai engine utama dalam setiap touchpoint: supplier discovery, lead scoring, inquiry response suggestion, dan listing optimization.
* **Efisiensi Operasional** — Mengotomasi proses klasifikasi produk melalui AI HS Code Classifier dan menyederhanakan workflow komunikasi buyer-supplier.
* **Koneksi Global** — Menjembatani supplier lokal dengan buyer internasional melalui ekosistem digital yang aman dan terstruktur.

---

## III. ANALISIS PERMASALAHAN (PAIN POINTS)

| Masalah | Dampak bagi Trader | Solusi Grawizah |
| :--- | :--- | :--- |
| Kesalahan HS Code | Denda bea cukai dan keterlambatan logistik | AI HS Code Classifier (Groq/Llama 3) |
| Buta Data Kompetitor | Kesulitan memantau tren harga global secara real-time | Competitor Benchmarking — data dari trade database |
| Inefisiensi Pencarian Buyer | Minimnya akses ke data buyer potensial terverifikasi | Buyer Radar + AI Lead Scoring (Buy Score) |
| Keterbatasan Visibilitas Digital | UKM sulit bersaing dengan perusahaan modal besar | Etalase digital + Premium Badge system |
| Supplier Asimetri | Supplier tidak punya insight kualitas buyer yang masuk | Inquiry Analytics + Buyer Quality Score (Baru) |

---

## IV. KERANGKA KONSEP & MODEL BISNIS

**4.1 Repositioning: Pre-Transaction Intelligence Platform**
Grawizah bukan direktori pasif, dan bukan pula marketplace transaksional. Grawizah mengisi lapisan yang selama ini kosong di antara keduanya: pre-transaction orchestration. Semua fitur — RFQ, inquiry tracking, document vault, chat — adalah instrumen untuk mempersiapkan dan mengkualifikasi deal, bukan untuk menyelesaikannya secara finansial.

✅ *Non-transactional dalam pembayaran, full-capability dalam pre-deal intelligence. Grawizah adalah Control Tower buyer-supplier sebelum tinta kontrak ditandatangani.*

**4.2 Alur Operasional Terintegrasi**
| Tahap | Aksi Platform | AI Engine Terlibat | Output untuk Trader |
| :--- | :--- | :--- | :--- |
| 1. Discover | Buyer browse katalog → Supplier AI-ranked | AI Recommended Suppliers | Peningkatan visibilitas pencarian |
| 2. Qualify | Buyer Radar + Buy Score AI | 82% conversion probability | Trader tahu buyer mana worth dikejar |
| 3. Engage | Inquiry → Chat → WA Bridge | AI Response Suggestion (Baru)| Reply lebih cepat, konversi lebih tinggi |
| 4. Track | Dashboard + Inquiry Analytics | Conversion rate tracking | Insight nyata: inquiry → deal rate |
| 5. Rank | Leaderboard (business metric) | Weighted score formula | Posisi kompetitif di kategori produk |

**4.3 Strategi Monetisasi**
| Tier | Deskripsi | Target |
| :--- | :--- | :--- |
| Basic (Free Trader) | Akses direktori standar, etalase digital, upload katalog produk, In-App Chat, HS Code AI (3x/hari), Analytics dasar | UKM baru untuk hadir digital |
| Premium Intelligence | Full Buyer Radar, AI Lead Scoring, Benchmarking, Unlimited AI HS Code, Market Alerts, AI Response Suggestion | Trader ekspansi progresif |

---

## V. AI SEBAGAI CORE ENGINE — BUKAN FITUR TAMBAHAN

Grawizah mengklaim sebagai AI-powered platform. Klaim ini harus tercermin di setiap touchpoint utama user — bukan hanya di fitur premium tertentu. 

| Touchpoint User | AI yang Terlibat | Output AI | Tier |
| :--- | :--- | :--- | :--- |
| Buyer browse katalog | AI Supplier Ranking | Supplier diurutkan berdasarkan probabilitas konversi | Semua |
| Supplier upload produk | AI Listing Optimizer | Saran perbaikan judul, deskripsi, HS Code | Basic & Premium |
| Buyer kirim inquiry | AI Lead Scoring | Skor konversi buyer ke supplier (0-100) | Premium |
| Supplier membalas inquiry| AI Response Suggestion | Draft balasan otomatis bahasa buyer | Premium |
| Supplier lihat kompetitor| AI Competitor Benchmarking| Analisis harga, positioning, gap peluang | Premium |
| Trader klasifikasi produk | AI HS Code Classifier | Rekomendasi kode + confidence score (Groq) | Basic (3x) / Premium (∞)|
| Supplier lihat market | AI Market Alerts | Notifikasi buyer aktif di negara target | Premium |

📊 **Sumber Data Intelligence**: Buyer Radar & Competitor Benchmarking menggunakan data dari UN Comtrade, customs declaration records. Fase awal (early-stage) menggunakan synthetic estimation dengan label 'Estimated'.

---

## VI. FITUR UNGGULAN (CORE FEATURES)

1. **AI HS Code Classifier:** Rekomendasi kode HS internasional berbasis deskripsi produk — didukung Groq API (Llama 3). 
2. **Buyer Radar + AI Lead Scoring:** Database buyer dengan Buy Score (0-100) berbasis riwayat impor.
3. **AI Supplier Ranking:** Buyer melihat supplier yang diurutkan AI (relevansi, track record, match score).
4. **AI Listing Optimizer:** Saran perbaikan konten saat upload produk.
5. **AI Response Suggestion:** Draft balasan otomatis ke buyer (mempercepat response time).
6. **Competitor Benchmarking:** Grafik perbandingan harga dan strategi kompetitor.
7. **Market Opportunity Alerts:** Notifikasi buyer aktif di negara target.
8. **In-App Chat & WA Bridge:** Komunikasi langsung dengan buyer.
9. **Inquiry Analytics:** Analisis volume, response rate, conversion rate.

---

## VII. IDENTITAS VISUAL & TECH STACK

**7.1 Brand Identity**
* **Primary Purple:** Deep Royal Purple (#6D28D9) — Mewah & eksklusif
* **Accent Blue:** Electric Blue (#3B82F6) — Teknologi & trust
* **Base White:** Clean White (#FFFFFF) — Profesional & bersih

**7.2 Spesifikasi Teknologi**
* **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
* **Backend:** Golang (Go)
* **API Protocol:** REST + gRPC
* **Database & Auth:** Supabase (PostgreSQL)
* **AI Engine:** Groq API — Llama 3
* **Deployment:** Vercel / Cloudflare + Docker

---

## VIII. MATRIKS HAK AKSES (ROLE SISTEM)

* **Guest:** Browse publik dengan harga range (tersensor penuh perlu register).
* **Free Trader:** Upload produk, Chat In-App, HS Code terbatas, Analytics dasar.
* **Premium Trader:** Full access Buyer Radar, AI Response, Market Alerts, Unlimited HS Code.
* **Verified Buyer:** Demand initiator (Submit RFQ, Compare Supplier).
* **Super Admin:** Verifikasi KYC, moderasi, audit log.

---

## IX. IMPLEMENTASI OOP (OBJECT-ORIENTED PROGRAMMING)

Grawizah mengimplementasikan prinsip OOP di seluruh layer sistem (Full-Stack).

**1. OOP di Frontend (Next.js/TypeScript)**
* **Encapsulation:** Class `ProductModel`, `UserModel`.
* **Inheritance:** `BaseCard` diwarisi oleh `ProductCard` dan `SupplierCard`.
* **Polymorphism:** Unified `InquiryHandler` dengan implementasi berbeda untuk Chat, WA, Email.
* **Abstraction:** Repository pattern untuk API data access.

**2. OOP di Backend (Golang)**
* **Encapsulation:** Struct dengan exported/unexported fields.
* **Inheritance:** Struct embedding (`BaseEntity` di-embed ke `Product`, `Company`).
* **Polymorphism:** Interface `AIProvider` (GroqProvider, FallbackProvider).
* **Abstraction:** Repository interface memisahkan logic dari storage (Supabase).

**3. OOP di Database (PostgreSQL)**
* **Encapsulation:** Row-Level Security (RLS) Policy.
* **Inheritance:** Hierarki referensi (Companies → Users FK).
* **Polymorphism:** Polymorphic tabel `inquiries` via ENUM `source_type`.
* **Abstraction:** Database Views untuk kompleksitas JOIN (misal: `v_leaderboard_ranked`).

---

## X. AI DALAM LOMBA WEB DEV — INOVASI & JUSTIFIKASI

Penggunaan AI Grawizah dijustifikasi penuh (Bukan sekadar fitur tambahan). 

**Inovasi:**
1. **AI bukan dekorasi:** AI menyelesaikan masalah HS Code yang fatal secara regulasi bea cukai.
2. **AI Lead Scoring B2B:** Tidak ada di platform lokal, menggunakan LLM men-generate konversi probabilitas berdasar data kontekstual.
3. **Keadilan Ekosistem (Merit-Based AI Ranking):** Menolak *Pay-to-top*. UKM murni bersaing berdasarkan relevansi produk bukan kekuatan modal iklan.
4. **Structured Output LLM:** Memakai model Llama 3 via Groq (latensi <500ms) menggunakan JSON structure agar UI bisa langsung bereaksi (bukan sekadar text-box ChatGPT).

*Grawizah Intelligence Hub — 2026 | Confidential | grawizah.com*
