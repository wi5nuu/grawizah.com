# 🎥 GRAWIZAH: 3-5 MINUTE VIDEO DEMO SCRIPT & TESTING GUIDE

*Panduan Perekaman Layar Resmi Khusus untuk Lomba TIC 2026*

---

## 🛑 PERSIAPAN WAJIB SEBELUM MEREKAM LAYAR
1. **Jalankan Aplikasi dalam Mode Production**:
   - Terminal 1: `go run cmd/main.go` (Backend)
   - Terminal 2: `npm run build` lalu `npm start` (Frontend - Wajib `start`, bukan `dev`!)
2. **Gunakan Google Chrome Incognito**:
   - Buka `http://localhost:3000` di jendela penyamaran untuk mencegah lag dari ekstensi/adblocker dan agar skor Lighthouse 100/100 jika ditanya juri.
3. **Siapkan Akun Dummy**:
   - **Akun Buyer:** `buyer@gmail.com`
   - **Akun Supplier Premium:** `premium@gmail.com`
   - *(Pastikan Anda hafal / sudah mencatat passwordnya agar proses login cepat di video).*

---

## 🎬 NASKAH DAN SKENARIO VIDEO (DURASI 3 - 5 MENIT)

*Tujuan utama video ini adalah mendemonstrasikan Alur Grawizah: **Data → Insight → Action → Result** dengan menonjolkan inovasi AI sungguhan (HS Code & Response Suggestion).*

### ⏱ 0:00 - 0:45 | BAGIAN 1: THE PROBLEM & GRAWIZAH SOLUTION
* **Visual di Layar:**
  - Tampilkan halaman depan (Landing Page - `localhost:3000`).
  - Scroll perlahan memperlihatkan tag line "Pre-Transaction Intelligence".
* **Voice Over (Narasi):**
  *"Halo Juri TechSprint Innovation Cup 2026. Ekspor UMKM kita menyimpan potensi besar, namun sering gagal karena salah klasifikasi HS Code, bahasa, dan kurangnya insight buyer. Grawizah hadir sebagai Pre-Transaction Intelligence Hub. Bukan marketplace biasa, tapi platform pintar bertenaga AI untuk memenangkan negosiasi B2B."*

### ⏱ 0:45 - 1:30 | BAGIAN 2: BUYER EXPERIENCE (The Discovery)
* **Visual di Layar:**
  - Login menggunakan akun **Buyer**.
  - Masuk ke menu `/catalog` (Global Catalog).
  - Arahkan kursor ke indikator "AI-Ranked".
  - Klik salah satu produk, buka form Inquiry, dan ketik pesan pendek: *"Hi, looking for 5 MT of this product for export."* lalu klik Kirim.
* **Voice Over (Narasi):**
  *"Di sisi Buyer global, mereka mencari produk di katalog yang menggunakan sistem AI-Ranking—murni berdasarkan kecocokan, bukan siapa yang bayar iklan paling besar. Buyer tertarik, lalu mengirimkan inquiry langsung ke supplier lokal kita."*

### ⏱ 1:30 - 2:45 | BAGIAN 3: SUPPLIER EXPERIENCE & REAL AI (The Killer Feature) 🔥
* **Visual di Layar:**
  - Cepat Logout Buyer, Login sebagai **Supplier Premium**.
  - Masuk ke Dashboard Utama. Tunjukkan angka konversi dan status akun "Premium".
  - Buka menu **Inquiries**. Tunjukkan pesan dari Buyer tadi. 
  - Sorot kolom skor **Buy Score / AI Lead Scoring**.
  - **KLIK TOMBOL "AI Response Suggestion"**. Tunggu LLM (Llama 3 / Groq) men-generate teks bahasa Inggris secara real-time. Klik kirim balasan!
* **Voice Over (Narasi):**
  *"Inquiry masuk ke Dashboard Supplier. Sistem secara proaktif memunculkan skor probabilitas dari Buyer Radar. Dan yang paling inovatif, supplier tidak perlu bingung bahasa asing. Klik tombol 'AI Response', dan Llama 3 secara real-time menganalisis konteks dan membuatkan draft balasan diplomatis B2B secara otomatis. Komunikasi menjadi sangat cepat!"*

### ⏱ 2:45 - 3:45 | BAGIAN 4: AI HS CODE CLASSIFIER & INTELLIGENCE
* **Visual di Layar:**
  - Buka menu **Products -> Add Product**.
  - Ketik Nama Produk (misal: "Biji Kopi Arabika Premium").
  - Tunggu 1-2 detik, tunjukkan kolom HS Code yang otomatis terisi oleh AI Backend (Highlight/tunjuk dengan kursor mouse).
  - Pindah ke menu **Intelligence** `/dashboard/intelligence` untuk memperlihatkan grafik Market & Competitor secara sekilas.
* **Voice Over (Narasi):**
  *"Risiko bea cukai akibat salah kode HS dapat dihindari. Saat mengupload produk, sistem NLP kita langsung mengklasifikasikan kode HS yang paling tepat secara otomatis. Di sisi Intelligence, trader Premium punya akses radar harga kompetitor global untuk benchmarking."*

### ⏱ 3:45 - 4:15 | BAGIAN 5: CLOSING & RESULT
* **Visual di Layar:**
  - Buka menu **Leaderboard** (tunjukkan skor ranking konversi bisnis).
  - Kembali ke Beranda / Logout.
* **Voice Over (Narasi):**
  *"Semua aksi, kecepatan respons, dan konversi tersebut akan dinilai dalam Business Leaderboard. Grawizah: Membangun Data, Memberikan Insight, Memfasilitasi Aksi, untuk Hasil Ekspor Maksimal. Terima kasih."*

---

## 🛡️ STATUS KEJUJURAN TEKNIS (PENTING JIKA DITANYA JURI)
Jika setelah video juri bertanya mengenai detail arsitektur, ingat status ini:
- **Real AI (Tersambung ke Groq API/Backend Asli):** *HS Code Classifier*, *AI Response Suggestion*.
- **Mocked / Simulated untuk Demo MVP:** *Competitor Benchmarking*, *Market Alerts*, dan *Buyer Radar Scoring* (Secara UI fungsional dan bereaksi dinamis, tapi data di backend menggunakan rumus generator / angka statis untuk keperluan demonstrasi hackathon).

**Video selesai! 🎥 Semoga Sukses!**
