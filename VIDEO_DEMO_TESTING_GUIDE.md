# 🎥 GRAWIZAH: 3-5 MINUTE VIDEO DEMO SCRIPT & TESTING GUIDE

*Panduan Perekaman Layar Resmi Khusus untuk Lomba TIC 2026*

---

## 🛑 PERSIAPAN WAJIB SEBELUM MEREKAM LAYAR

1. **Jalankan Aplikasi dalam Mode Production**:
   * Terminal 1: `go run cmd/main.go` (Backend)
   * Terminal 2: `npm run build` lalu `npm start` (Frontend - Wajib `start`, bukan `dev`!)

2. **Gunakan Google Chrome Incognito**:
   * Buka `http://localhost:3000` di jendela penyamaran agar status selalu *logged out* di awal, dan agar skor Lighthouse optimal.

3. **Persiapkan Data Dummy**:
   * Siapkan dua email yang belum pernah didaftarkan (contoh: `buyerdemo1@gmail.com` dan `supplierdemo1@gmail.com`) agar Anda bisa mendemokan fitur register (Sign Up) dengan mulus.

---

# 🎬 NASKAH DAN SKENARIO VIDEO (DURASI 3 - 5 MENIT)

*Skenario direvisi sesuai alur komprehensif: Landing Page → Catalog → Guest Friction → Register Buyer → Register Supplier → Inbox/Inquiries → Intelligence → Leaderboard.*

---

## ⏱ 0:00 - 0:45 | BAGIAN 1: THE PROBLEM & LANDING PAGE (Guest View)

### **Visual di Layar:**
* Tampilkan halaman depan (Landing Page - `localhost:3000`). Posisi belum login (Guest).
* Scroll perlahan memperlihatkan tag line **"Pre-Transaction Intelligence"** dan highlight fitur AI.

### **Voice Over (Narasi):**
> "Halo Juri TechSprint Innovation Cup 2026. Ekspor UMKM kita menyimpan potensi besar, namun sering gagal karena salah klasifikasi HS Code, kendala bahasa, dan kurangnya insight terhadap buyer. Grawizah hadir sebagai Pre-Transaction Intelligence Hub. Bukan marketplace biasa, tapi platform pintar bertenaga AI untuk memenangkan negosiasi B2B."

---

## ⏱ 0:45 - 1:45 | BAGIAN 2: CATALOG & BUYER REGISTRATION (Discovery)

### **Visual di Layar:**
* Buka menu **Catalog / Directory**.
* Tunjukkan UI bersih dan indikator **"AI-Ranked"**.
* Sebagai Guest, coba klik **"Contact Supplier"** / **"Send Inquiry"** pada salah satu produk.
* Sistem akan menahan dan meminta login/register.
* Pilih **Sign Up**, lalu buat akun sebagai **Buyer**.
* Setelah berhasil login/register sebagai Buyer, ulangi langkah mengirim pesan.
* Ketik pesan:
  > "Halo kak admin, butuh penawaran untuk produk ini."
* Klik **Kirim**.

### **Voice Over (Narasi):**
> "Di direktori global kami, produk diurutkan menggunakan AI-Ranking berbasis relevansi. Grawizah menjaga privasi data B2B secara ketat; Guest tidak bisa sembarangan mengirim pesan tanpa verifikasi KYC. Setelah saya melakukan registrasi singkat sebagai Buyer Global, saya baru bisa mengirimkan Request for Quotation atau pesan langsung ke supplier lokal incaran saya."

---

## ⏱ 1:45 - 2:45 | BAGIAN 3: SUPPLIER INBOX & REAL AI (Communication Hub) 🔥

### **Visual di Layar:**
* Logout akun Buyer.
* Klik **Sign Up** lagi, kali ini buat akun baru sebagai **Supplier (Premium Trader)**.
  *(Atau login pakai akun Supplier yang sudah ada pesan masuknya).*
* Masuk ke menu:
  > `/dashboard/inquiries`
* Sorot tabel Inbox:
  * Nama buyer (contoh: *Ashar Grosir Parfum*)
  * Isi pesan
  * Status (`open` / `responded`)
* Tunjukkan skor:
  * **Compliance**
  * **Buy Score**
* Klik tombol:
  > **"AI Response Suggestion"**
* Tunggu AI generate balasan bahasa Inggris.
* Klik kirim balasan.
* Sorot tombol:
  > **"Convert"**

### **Voice Over (Narasi):**
> "Sekarang, mari kita pindah ke sudut pandang Supplier. Pesan dari buyer masuk ke Communication Hub. Sistem kami secara proaktif memunculkan skor 'Compliance' atau probabilitas konversi buyer. Jika skornya 90, supplier tahu buyer ini serius. Dan yang paling inovatif, supplier tidak perlu takut kendala bahasa asing. Cukup klik 'AI Response', dan Llama 3 kami secara real-time merangkai draf balasan diplomatis B2B secara otomatis. Setelah negosiasi sukses, supplier tinggal klik 'Convert'."

---

## ⏱ 2:45 - 3:30 | BAGIAN 4: INTELLIGENCE DASHBOARD & AI HS CODE

### **Visual di Layar:**
* Pindah ke menu:
  > `/dashboard/intelligence`
* Tunjukkan:
  * Grafik Market Demand
  * Competitor Benchmark
  * Tombol **"Run AI Audit"**
* Lalu pindah ke:
  > `Products → Add Product`
* Ketik nama produk:
  > "Biji Kopi Arabika Premium"
* Tunggu 1–2 detik.
* Tunjukkan kolom **HS Code** otomatis terisi AI.

### **Voice Over (Narasi):**
> "Supplier Premium memiliki akses ke Intelligence Dashboard. Di sini mereka bisa memantau pergerakan harga pasar global dan benchmarking kompetitor. Selain itu, kami juga memecahkan masalah fatal bea cukai: salah kode HS. Saat upload produk, sistem NLP Groq kami langsung mengklasifikasikan kode HS internasional yang paling tepat secara otomatis, hanya dalam hitungan detik."

---

## ⏱ 3:30 - 4:15 | BAGIAN 5: LEADERBOARD & CLOSING

### **Visual di Layar:**
* Buka menu:
  > `/dashboard/leaderboard`
* Sorot metrik utama:
  * **Score**
  * **Conv (Conversion Rate)**
  * **Fulfill (Fulfillment Success)**
  * **Status**
* Kembali ke Beranda atau tampilkan logo Grawizah.

### **Voice Over (Narasi):**
> "Semua aksi, mulai dari kecepatan membalas pesan hingga menekan tombol Convert tadi, akan direkam ke dalam Business Leaderboard. Juri bisa melihat bahwa metrik kami bukan sekadar siapa paling banyak klik, melainkan metrik bisnis riil: Conversion Rate dan Fulfillment Success. Grawizah mengubah direktori pasif menjadi ekosistem aktif untuk hasil ekspor UMKM maksimal. Terima kasih."

---

# 🛡️ STATUS KEJUJURAN TEKNIS (PENTING JIKA DITANYA JURI)

Jika setelah video juri bertanya mengenai detail arsitektur, gunakan penjelasan berikut:

### ✅ Real AI (Tersambung ke Groq API / Backend Asli)
* HS Code Classifier
* AI Response Suggestion

### ⚠️ Mocked / Simulated untuk Demo MVP
* Competitor Benchmarking
* Market Alerts
* Buyer Radar Scoring

> *Secara UI seluruh fitur tetap interaktif dan responsif, namun sebagian data backend masih menggunakan generator atau angka simulasi untuk kebutuhan demonstrasi hackathon MVP.*
