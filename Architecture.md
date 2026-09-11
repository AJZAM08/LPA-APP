# Architecture.md - Sistem Laporan Perkembangan Anak (LPA)

> **Versi:** 1.0.0  
> **Target Release:** MVP (Phase 2)  
> **Status:** Approved / Ready for Implementation  
> **Lead Architect:** Ajiz Abdul Majid  

---

## 1. Ringkasan Arsitektur & Prinsip Desain

Sistem Laporan Perkembangan Anak (LPA) dibangun dengan arsitektur **Monolith Modern (Modular Monolith) berbasis Jamstack/SSR** yang dioptimalkan untuk kecepatan pembuatan laporan bagi guru (≤ 2 menit/siswa) dan akses sangat cepat (ultra-lightweight & zero-friction) bagi orang tua melalui browser seluler tanpa registrasi/login.

### Prinsip Desain Utama:
1. **Zero Barrier for Parents:** Orang tua tidak memerlukan akun atau instalasi aplikasi native. Akses berbasis Secure Cryptographic Token URL.
2. **Speed & Ergonomics for Teachers:** UI guru dirancang secara ergonomis dengan optimasi autosave, template siap pakai, dan integrasi direct deep link WhatsApp Web/App (`wa.me`).
3. **Stateless Public Read & Rate Limited Submission:** Sisi publik orang tua di-cache secara efisien dan diproteksi dari scraping/spamming menggunakan nonce token, rate limiting, dan secure headers.
4. **Data Isolation & Privacy:** Token akses privat sulit ditebak (UUID v4 / Nanoid 24-char entropy tinggi) dengan kontrol validitas waktu dan opsi pembatalan.

---

## 2. Arsitektur Sistem Tingkat Tinggi (High-Level Architecture)

```
                       +----------------------------------------------------+
                       |                 PENGGUNA (ACTORS)                  |
                       +-------------------------+--------------------------+
                                                 |
                     +---------------------------+---------------------------+
                     |                                                       |
            [Guru / Pengajar]                                    [Orang Tua Siswa]
                     |                                                       |
        Web App (Desktop / Mobile)                             Mobile Browser (No Auth)
        Autentikasi (JWT / Session)                            Akses via Secure Link URL
                     |                                                       |
                     v                                                       v
+---------------------------------------------------------------------------------------+
|                                    GATEWAY / EDGE                                     |
|                       Reverse Proxy, HTTPS Termination, Rate Limiting                |
+---------------------------------------------------------------------------------------+
                                                 |
+---------------------------------------------------------------------------------------+
|                             APPLICATION LAYER (Next.js / Node.js)                     |
|                                                                                       |
|  +------------------------+  +------------------------+  +-------------------------+  |
|  |    Auth & Teacher      |  |    Report Engine       |  |   Parent Public Gateway |  |
|  |    Student Management  |  |  Template & Generator  |  |   Feedback Intake Form  |  |
|  +------------------------+  +------------------------+  +-------------------------+  |
|                                                                                       |
|  +---------------------------------------------------------------------------------+  |
|  |                       Notification & Link Dispatch Service                      |  |
|  |            - WhatsApp Universal Deep Link Generator (wa.me/?text=...)           |  |
|  +---------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------+
                                                 |
+---------------------------------------------------------------------------------------+
|                                      DATA LAYER                                       |
|                                                                                       |
|  +---------------------------------------+  +--------------------------------------+  |
|  |     Relational Database (PostgreSQL)  |  |         Object Storage (S3)          |  |
|  | (Students, Reports, Feedback, Tokens) |  |   (Opsional lampiran/foto anak v1.1) |  |
|  +---------------------------------------+  +--------------------------------------+  |
+---------------------------------------------------------------------------------------+
```

---

## 3. Komponen Sistem & Teknologi (Tech Stack)

| Lapisan / Layer | Teknologi Rekomendasi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Frontend & Backend** | Next.js (TypeScript) | Satu basis kode (Modular Monolith), Server-Side Rendering (SSR) untuk kecepatan loading link orang tua, API Routes untuk backend logic. |
| **Database** | PostgreSQL | Integritas relasional kuat (ACID), andal, dukungan JSONB untuk template materi/kompetensi fleksibel. |
| **ORM / Query Builder** | Prisma ORM | Tipe aman (*type-safety* end-to-end), migrasi skema deklaratif, produktivitas tinggi. |
| **Autentikasi Guru** | NextAuth.js / Supabase Auth | Autentikasi aman berbasis sesi/JWT untuk guru. |
| **Security & Rate Limit** | Upstash Redis / Memory Store | Mencegah brute force token link orang tua dan spamming form feedback. |
| **Styling & UI** | Tailwind CSS + Shadcn UI | Desain clean, mobile-first, sangat ringan dan cepat diakses di smartphone kentang sekalipun. |
| **Integrasi Eksternal** | WhatsApp Deep Link API | Zero cost, tidak perlu penyedia BSP/Cloud API berbayar pada v1, membuka native app WhatsApp dengan pre-filled text. |

---

## 4. Alur Kerja Sistem (Key Workflow Sequence)

### 4.1 Alur Pembuatan & Pembagian Laporan
```
[Guru]                    [LPA Application]                 [Database]            [WhatsApp App]
  |                               |                             |                       |
  |--- 1. Isi Form Laporan ------>|                             |                       |
  |    (Siswa, Materi, Progres)   |                             |                       |
  |                               |--- 2. Simpan Data Laporan ->|                       |
  |                               |<-- 3. Report Created -------|                       |
  |                               |                             |                       |
  |                               |--- 4. Generate Secure Token>|                       |
  |                               |    (nanoid-24 URL-Safe)     |                       |
  |                               |<-- 5. Token Stored ---------|                       |
  |                               |                             |                       |
  |--- 6. Klik "Kirim WhatsApp" ->|                             |                       |
  |                               |--- 7. Buat wa.me Link ----->|                       |
  |<-- 8. Redirect / Open App ----|    (Template + Secure URL)  |                       |
  |                                                                                     |
  |============================= 9. Kirim Chat WA ke Orang Tua ========================>|
```

### 4.2 Alur Konsumsi & Feedback Orang Tua
```
[Orang Tua]              [Mobile Browser]                  [LPA Server]           [Database]
  |                             |                               |                      |
  |--- 1. Tap Link dari WA ---->|                               |                      |
  |                               |--- 2. GET /report/[token] --->|                      |
  |                               |                               |--- 3. Validate Token>|
  |                               |                               |    & Increment View  |
  |                               |                               |<-- 4. Return Report -|
  |                               |<-- 5. Render HTML Ringan -----|                      |
  |                               |    (Server Side Rendered)     |                      |
  |--- 6. Baca & Isi Feedback ->|                               |                      |
  |--- 7. Submit Feedback ----->|                               |                      |
  |                               |--- 8. POST /api/feedback ---->|                      |
  |                               |    (Include Token Payload)    |--- 9. Save Feedback->|
  |                               |                               |<-- 10. Success ------|
  |                               |<-- 11. Tampilkan Notif Sukses |                      |
```

---

## 5. Pertimbangan Keamanan & Privasi (Security & Privacy)

1. **Token Security Model:**
   - Link publik menggunakan cryptographic token ber-entropi tinggi (`crypto.randomBytes` atau `nanoid(24)`).
   - Menghindari penggunaan ID sekuensial (misal: `/report/123` sangat dilarang untuk mencegah enumerasi URL).
   - Format: `https://lpa.sekolah.id/r/[access_token]`
2. **Access Revocation & Expiration:**
   - Token dapat dinonaktifkan secara manual oleh guru jika salah kirim.
   - Masa aktif default token dapat dikonfigurasi (misal: aktif 30 hari atau permanen read-only setelah diarsipkan).
3. **Spam & Abuse Protection pada Feedback:**
   - Rate limit IP: maksimal 5 submisi feedback per menit per IP.
   - One-time Submission Lock: Opsi untuk mengunci form feedback setelah satu kali dikirimkan, atau mode append dengan batas waktu.
   - Input sanitization untuk mencegah Cross-Site Scripting (XSS).

---

## 6. Deployment & Infrastruktur
- **Web App / API Engine:** Vercel / Railway / VPS Docker Container.
- **Database:** Managed PostgreSQL (Supabase, Neon, atau RDS).
- **Domain & CDN:** Cloudflare (SSL/TLS Termination, DDoS protection, edge caching untuk asset statis).
