# Design.md - UI/UX Specification & Design System

> **Sistem:** Laporan Perkembangan Anak (LPA)  
> **Target Pengguna:** Guru (Desktop/Mobile Web), Orang Tua (Mobile Viewport Web)  
> **Filosofi Desain:** *Warm, Respectful, Zero-Friction, & Fast*  

---

## 1. Prinsip & Arah Desain (Design Principles)

1. **Zero-Cognitive Load for Parents:**
   - Halaman orang tua harus langsung menyajikan inti laporan dalam 1 layar scrolling.
   - Tidak ada elemen navigasi yang membingungkan, banner promosi, atau formulir registrasi yang menghambat.
2. **Speed-First Data Entry for Teachers:**
   - Guru honorer memiliki keterbatasan waktu. Form dibuat linear, autosaving draft, dengan tombol *Quick-Fill / Template* materi.
   - Waktu pembuatan laporan dibatasi target ≤ 2 menit per siswa.
3. **Warm & Nurturing Aesthetic:**
   - Palet warna hangat (Emerald Green & Warm Amber/Sand) melambangkan pertumbuhan anak dan empati pendidikan.

---

## 2. Design System & Style Guide

### 2.1 Palet Warna (Color Palette)
| Nama Warna | Hex Code | Peruntukan |
| :--- | :--- | :--- |
| **Primary Emerald** | `#0D5C46` | Header utama, tombol aksi primer, branding guru |
| **Primary Light** | `#E8F5F1` | Background badge, highlight informasi siswa |
| **Accent Warm Amber**| `#E5983A` | Callout saran di rumah, rating bintang/reaksi |
| **Neutral Dark** | `#1A202C` | Tipografi utama, teks judul |
| **Neutral Muted** | `#4A5568` | Body text, instruksi form, label sekunder |
| **Surface Off-White**| `#F8FAFC` | Background halaman web (mencegah kelelahan mata) |
| **Card White** | `#FFFFFF` | Background kartu laporan & form |
| **Success Green** | `#16A34A` | Status 'Sudah Ada Feedback', notifikasi sukses |
| **Warning Orange** | `#EA580C` | Status 'Menunggu Feedback' |

### 2.2 Tipografi (Typography)
- **Primary Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Skala Ukuran:**
  - `H1 (Page Title):` 24px - 28px (Bold)
  - `H2 (Card Section):` 18px - 20px (Semi-Bold)
  - `H3 (Sub-header):` 15px - 16px (Medium)
  - `Body Regular:` 14px (Regular, Line-height: 1.5)
  - `Caption / Footnote:` 12px (Regular / Muted)

---

## 3. Desain Tampilan Pengguna (Screens & Layouts)

### 3.1 Layar Guru 1: Form Pembuatan Laporan (`/teacher/reports/new`)
Form dibuat secara vertikal bertahap (single-column) untuk mencegah distraksi.

```
+-------------------------------------------------------------+
| [Logo LPA]  Halo, Pak Anas (Guru Kelas 2)      [Logout]     |
+-------------------------------------------------------------+
| <- Kembali ke Daftar Siswa                                  |
|                                                             |
| BUAT LAPORAN PERKEMBANGAN ANAK                              |
| Pertemuan: [ 10 Sep 2026 (v) ]                              |
|                                                             |
| 1. Pilih Siswa:                                             |
|    [ Budi Pratama                    (v) ]                  |
|    WA Ortu: +62 812-3456-7890                               |
|                                                             |
| 2. Materi yang Dipelajari Hari Ini:                         |
|    [ Perkalian Angka 3 dan Pemahaman Cerita          ]      |
|    (Pilihan Cepat: [Matematika Dasar] [Membaca Cepat])      |
|                                                             |
| 3. Catatan Perkembangan Siswa:                              |
|    +------------------------------------------------------+ |
|    | Budi sangat antusias dan mampu menjawab 8 dari 10    | |
|    | soal perkalian tanpa bantuan. Fokus cukup stabil.    | |
|    +------------------------------------------------------+ |
|                                                             |
| 4. Rekomendasi Latihan di Rumah:                            |
|    +------------------------------------------------------+ |
|    | Mohon didampingi mengulang tabel perkalian 3 selama  | |
|    | 5-10 menit sebelum tidur dengan cara santai.         | |
|    +------------------------------------------------------+ |
|                                                             |
| [ Preview Laporan ]              [ Simpan & Bagikan ke WA ] |
+-------------------------------------------------------------+
```

### 3.2 Layar Guru 2: Modal Pembagian WhatsApp & Preview
Setelah tombol "Simpan & Bagikan ke WA" diklik:

```
+-------------------------------------------------------------+
| Laporan Budi Pratama Berhasil Dibuat!                     X |
+-------------------------------------------------------------+
| Link Laporan telah siap:                                    |
| [ https://lpa.sekolah.id/r/k7X2nL9q0vWm             ] [Copy]|
|                                                             |
| Template Pesan WhatsApp:                                    |
| +---------------------------------------------------------+ |
| | Yth. Orang Tua Budi Pratama,                            | |
| | Berikut kami sampaikan laporan perkembangan ananda      | |
| | pada pertemuan hari ini (10 Sep 2026):                  | |
| | https://lpa.sekolah.id/r/k7X2nL9q0vWm                   | |
| |                                                         | |
| | Mohon luangkan waktu 1 menit untuk membaca & mengisi    | |
| | catatan balik di link tersebut. Terima kasih.           | |
| +---------------------------------------------------------+ |
|                                                             |
| [ Salin Pesan ]       [ Buka WhatsApp Sekarang (wa.me) -> ] |
+-------------------------------------------------------------+
```

### 3.3 Layar Orang Tua: Tampilan Laporan & Form Feedback (`/r/[token]`)
Tampilan di browser handphone orang tua tanpa navbar/login:

```
+-------------------------------------------------------------+
|  SDN Harapan Ceria - Laporan Belajar Siswa                 |
+-------------------------------------------------------------+
| Ananda: BUDI PRATAMA                                        |
| Tanggal: Kamis, 10 September 2026                           |
| Guru: Pak Anas                                              |
+-------------------------------------------------------------+
|                                                             |
| 📘 MATERI HARI INI                                          |
| Perkalian Angka 3 dan Pemahaman Cerita                      |
|                                                             |
| 🌟 PERKEMBANGAN ANANDA DI KELAS                             |
| Budi sangat antusias dan mampu menyelesaikan 8 dari 10     |
| soal perkalian mandiri. Fokus belajarnya meningkat pesat.   |
|                                                             |
| 💡 SARAN & LATIHAN DI RUMAH                                 |
| Mohon didampingi latihan perkalian 3 selama 5-10 menit      |
| secara santai di rumah.                                     |
|                                                             |
|-------------------------------------------------------------|
| 📝 RESPON / FEEDBACK ORANG TUA                              |
| Bagaimana tanggapan Ayah/Bunda hari ini?                    |
| [ 😊 Senang ]   [ 👍 Cukup Puas ]   [ 🤔 Butuh Diskusi ]    |
|                                                             |
| Catatan Ayah/Bunda untuk Guru (Opsional):                   |
| +---------------------------------------------------------+ |
| | Terima kasih infonya Pak Anas, nanti malam kami temani  | |
| | Budi latihan perkalian 3 lagi.                          | |
| +---------------------------------------------------------+ |
|                                                             |
| [        KIRIM TANGGAPAN UNTUK GURU        ]                |
|                                                             |
| Terkirim aman langsung ke Pak Anas                          |
+-------------------------------------------------------------+
```

### 3.4 Layar Guru 3: Riwayat Siswa & Status Feedback (`/teacher/students/[id]`)
Daftar riwayat sesi per siswa untuk memantau respons orang tua:

```
+-------------------------------------------------------------------------+
| <- Profil Siswa: Budi Pratama                       [+ Buat Laporan]    |
| Kontak Ortu: +62 812-3456-7890 (Ibu Ratna)                              |
+-------------------------------------------------------------------------+
| RIWAYAT PERTEMUAN & FEEDBACK                                            |
|-------------------------------------------------------------------------|
| 10 Sep 2026 | Perkalian Angka 3                                         |
| Status: [ SUDAH DIBALAS ORTU ]  (Dilihat 2x)                            |
| Tanggapan: 😊 "Terima kasih infonya Pak Anas, nanti malam kami temani..."|
| [Lihat Laporan] [Buka Chat WA]                                          |
|-------------------------------------------------------------------------|
| 03 Sep 2026 | Penjumlahan Bersusun                                      |
| Status: [ SUDAH DIBALAS ORTU ]  (Dilihat 1x)                            |
| Tanggapan: 👍 "Budi sudah paham, terima kasih bimbingannya."            |
| [Lihat Laporan] [Buka Chat WA]                                          |
|-------------------------------------------------------------------------|
| 27 Agu 2026 | Pengenalan Pola Geometri                                  |
| Status: [ MENUNGGU FEEDBACK ]   (Dilihat 1x)                            |
| Tanggapan: Belum ada tanggapan                                          |
| [Kirim Pengingat WA] [Lihat Laporan]                                    |
+-------------------------------------------------------------------------+
```

---

## 4. Pola Interaksi & UX States (Interaction States)

1. **Quick-Action WhatsApp Flow:**
   - Setelah laporan disimpan, aplikasi langsung membuka link `https://wa.me/{parent_phone}?text={encoded_message}` sehingga guru tidak perlu manual mengetik atau copy-paste nomor telepon.
2. **Offline Resilience / Retry:**
   - Bila koneksi lambat saat orang tua klik submit feedback, sistem menyimpan payload di `localStorage` dan menampilkan tombol *Coba Kirim Ulang* dengan indikator loading yang jelas tanpa kehilangan ketikan.
3. **Visual Feedback Indicator:**
   - Status Badge Laporan Guru:
     - `Draft`: Abu-abu
     - `Terkirim / Menunggu Feedback`: Oranye muda dengan ikon jam pasir
     - `Feedback Diterima`: Hijau dengan ikon centang & emoji reaksi orang tua
