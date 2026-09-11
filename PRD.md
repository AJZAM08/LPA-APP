# [Nama Produk / Fitur] - Product Requirement Document (PRD)

> **Status:** Draft  
> **Versi:** 1.0.0  
> **Product Manager / Owner:** Ajiz Abdul Majid  
> **Tech Lead / Architect:** Ajiz Abdul Majid
> **UI/UX Designer:** Ajiz Abdul Majid
> **Terakhir Diperbarui:** 2026/09/10  

---

## 1. Ringkasan Eksekutif (Executive Summary)
Sistem Laporan Perkembangan Anak (LPA) merupakan sistem yang membantu guru memberi laporan perkembangan anak kepada orang tua setelah setiap pertemuan, sistem ini ditujukan untuk guru dan dapat dilihat oleh orang tua, adapun tujuan sistem ini yaitu untuk memberikan informasi bukan hanya nilai tetapi apa saja yang dipelajari anak, bagaimana perkembangannya kepada orang tua.

- **Pernyataan Masalah (Problem Statement):** Saat ini proses Pendidikan anak cenderung lebih banyak melibatkan guru, sementara orang tua tidak selalu mengetahui apa yang dipelajari anak selama dikelas akibatnya orang tua kurang tau perkembangan dan materi yang dipelajari oleh anaknya.
- **Solusi yang Diajukan (Proposed Solution):** Guru dapat membuat laporan pembelajaran dengan mudah, dan memberikan informasi perkembangan anak pada laporan itu sehingga komunikasi antara guru dan orang tua lebih sederhana
- **Value Proposition:** Memanfaatkan kemutahiran teknologi dan dapat mempercepat komunikasi tanpa harus melaporkan satu persatu atau mengadakan rapat pertemuan orang tua yang berlebihan

---

## 2. Tujuan & Metrik Keberhasilan (Goals & Success Metrics)

### 2.1 Sasaran Bisnis & Produk (Goals)
- [ ] Meningkatkan keterlibatan orang tua dalam proses belajar anak.
- [ ] Mempermudah guru membuat dan mengirim laporan pembelajaran.
- [ ] Memusatkan feedback orang tua.
- [ ] Menghilangkan kebutuhan orang tua untuk membuat akun atau mengunduh aplikasi.
- [ ] Membangun komunikasi dua arah antara guru dan orang tua.
- [ ] Mengurangi waktu yang dibutuhkan guru untuk membuat satu laporan.

### 2.2 Bukan Sasaran (Non-Goals / Out of Scope)
- Tidak mencakup aplikasi native Android/iOS untuk orang tua.
- Tidak mewajibkan orang tua membuat akun atau login.
- Tidak membuat sistem chat real-time antara guru dan orang tua.
- Tidak mencakup video pembelajaran.
- Tidak mencakup ujian atau kuis online.
- Tidak mencakup sistem pembayaran.
- Tidak mencakup fitur marketplace atau penjualan kursus.
- Tidak mencakup fitur AI untuk membuat atau menganalisis laporan pada v1.
- Tidak mencakup sistem akademik lengkap seperti absensi, jadwal, kurikulum, dan pengelolaan nilai sekolah.
- WhatsApp pada v1 hanya digunakan sebagai media untuk membagikan link laporan, bukan sebagai tempat penyimpanan utama laporan dan feedback.

### 2.3 Metrik Keberhasilan (OKRs / KPIs)
| Metrik                              | Baseline Saat Ini |                       Target Pasca Rilis                      | Periode Evaluasi |
| :---------------------------------- | :---------------: | :-----------------------------------------------------------: | :--------------- |
| **Laporan Berhasil Dibuat**         |         0%        |           ≥ 90% dari pertemuan menghasilkan laporan           | 30 hari          |
| **Laporan Dibuka Orang Tua**        |   Belum tersedia  |                             ≥ 80%                             | 30 hari          |
| **Feedback Completion Rate**        |   Belum tersedia  |               ≥ 70% laporan mendapatkan feedback              | 30 hari          |
| **Waktu Membuat Laporan**           |   Belum tersedia  |                        ≤ 2 menit/siswa                        | 30 hari          |
| **Feedback Terdokumentasi**         |         0%        |               ≥ 95% feedback tersimpan di sistem              | 30 hari          |
| **Guru Menggunakan Kembali Sistem** |         0%        | ≥ 70% guru aktif menggunakan sistem pada pertemuan berikutnya | 60 hari          |
| **Teacher Satisfaction (CSAT)**     |   Belum tersedia  |                             ≥ 4/5                             | 30–60 hari       |
| **Parent Satisfaction (CSAT)**      |   Belum tersedia  |                             ≥ 4/5                             | 30–60 hari       |


---

## 3. Persona Pengguna (Target Audience)

### Persona 1: Anas - Guru
- **Demografi:** Guru Honorer, usia 25 tahun, terbiasa memakai teknologi seperti laptop dan handphone.
- **Pain Points:** Membuat laporan yang lama dan sulit, keterbatasan komunikasi dengan semua orang tua.
- **Needs:** Sistem pembuat laporan pembelajaran murid, bisa menampilkan perkembangan dan materi yang diajar di jam / pertermuan tersebut dan dapat dilihat oleh guru melalui link yang di berikan.

---

## 4. Alur Pengguna & User Stories (User Stories & Requirements)

### 4.1 Epics & User Stories

Epic 1 — Manajemen Data Siswa

| ID    | User Story                                                                                                             | Acceptance Criteria                                                                     |
| ----- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| US-01 | Sebagai **guru**, saya ingin menambahkan data siswa agar saya dapat membuat laporan pembelajaran untuk siswa tersebut. | Guru dapat memasukkan nama siswa dan nomor WhatsApp orang tua. Data berhasil tersimpan. |
| US-02 | Sebagai **guru**, saya ingin melihat daftar siswa agar saya dapat memilih siswa yang akan dibuatkan laporan.           | Sistem menampilkan daftar siswa yang terdaftar.                                         |
| US-03 | Sebagai **guru**, saya ingin mengubah data siswa jika terdapat perubahan informasi.                                    | Data siswa dapat diedit dan perubahan berhasil disimpan.                                |

Epic 2 — Membuat Laporan Pembelajaran

| ID    | User Story                                                                                                                                   | Acceptance Criteria                                            |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| US-04 | Sebagai **guru**, saya ingin memilih siswa agar saya dapat membuat laporan untuk siswa tersebut.                                             | Guru dapat memilih salah satu siswa dari daftar.               |
| US-05 | Sebagai **guru**, saya ingin mencatat materi yang dipelajari agar orang tua mengetahui pembelajaran pada pertemuan tersebut.                 | Materi dapat dimasukkan atau dipilih sebelum laporan disimpan. |
| US-06 | Sebagai **guru**, saya ingin mencatat perkembangan siswa agar orang tua mengetahui kemampuan anaknya.                                        | Guru dapat mengisi perkembangan siswa.                         |
| US-07 | Sebagai **guru**, saya ingin memberikan catatan dan rekomendasi agar orang tua mengetahui hal yang perlu diperhatikan atau dilatih di rumah. | Guru dapat menambahkan catatan dan rekomendasi.                |
| US-08 | Sebagai **guru**, saya ingin melihat preview laporan agar saya dapat memeriksa informasi sebelum dibagikan.                                  | Sistem menampilkan laporan sesuai data yang dimasukkan.        |

Epic 3 — Membagikan Laporan

| ID    | User Story                                                                                                                                    | Acceptance Criteria                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| US-09 | Sebagai **guru**, saya ingin membuat link unik untuk setiap laporan agar laporan dapat dibagikan kepada orang tua.                            | Sistem menghasilkan link unik untuk laporan.                      |
| US-10 | Sebagai **guru**, saya ingin membagikan link laporan melalui WhatsApp agar orang tua dapat menerima laporan tanpa harus menggunakan aplikasi. | Guru dapat menyalin/membagikan link laporan.                      |
| US-11 | Sebagai **orang tua**, saya ingin membuka laporan melalui link agar saya dapat mengetahui perkembangan anak tanpa harus login.                | Link dapat dibuka tanpa akun dan menampilkan laporan yang sesuai. |

Epic 4 — Feedback Orang Tua

| ID    | User Story                                                                                                                                  | Acceptance Criteria                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| US-12 | Sebagai **orang tua**, saya ingin memberikan feedback setelah membaca laporan agar guru mengetahui kondisi atau perkembangan anak di rumah. | Orang tua dapat mengisi feedback.                               |
| US-13 | Sebagai **orang tua**, saya ingin mengirim feedback dengan mudah tanpa membuat akun.                                                        | Feedback dapat dikirim tanpa proses registrasi/login.           |
| US-14 | Sebagai **guru**, saya ingin melihat feedback orang tua pada laporan terkait agar saya tidak perlu mencari feedback di WhatsApp.            | Feedback tampil pada laporan yang sesuai.                       |
| US-15 | Sebagai **guru**, saya ingin melihat riwayat feedback siswa agar dapat mengetahui perkembangan dan respons orang tua dari waktu ke waktu.   | Riwayat feedback dapat dilihat berdasarkan siswa dan pertemuan. |

Epic 5 — Riwayat Pembelajaran

| ID    | User Story                                                                                                                                    | Acceptance Criteria                                                                      |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| US-16 | Sebagai **guru**, saya ingin melihat seluruh laporan seorang siswa agar saya dapat mengetahui riwayat pembelajarannya.                        | Sistem menampilkan laporan berdasarkan siswa.                                            |
| US-17 | Sebagai **guru**, saya ingin mengetahui apakah orang tua sudah memberikan feedback agar saya dapat mengetahui apakah laporan telah direspons. | Status feedback ditampilkan, misalnya **Menunggu Feedback / Sudah Memberikan Feedback**. |
---

## 5. Rencana Rilis & Milestone (Release Plan)

[Phase 1: Analisis & Perancangan] -> [Phase 2: MVP Development] -> [Phase 3: Pilot Testing] -> [Phase 4: Improvement] -> [Phase 5: Pengembangan Lanjutan]

---

## 6. Risiko & Dependensi (Risks & Dependencies)

| Risiko                                         | Dampak                                     | Mitigasi                                                                  |
| ---------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| Guru merasa membuat laporan terlalu merepotkan | Guru malas menggunakan sistem              | Buat form sesingkat mungkin dan gunakan template/pilihan                  |
| Orang tua tidak membuka link                   | Feedback tidak diperoleh                   | Link dikirim melalui media yang sudah familiar, yaitu WhatsApp            |
| Orang tua malas memberikan feedback            | Data feedback tidak lengkap                | Feedback dibuat singkat dan sederhana                                     |
| Link laporan dibagikan ke orang lain           | Privasi siswa terganggu                    | Gunakan token/link unik yang sulit ditebak dan mekanisme keamanan         |
| Guru lupa mengirim laporan                     | Orang tua tidak menerima informasi         | Sediakan status laporan dan pengingat                                     |
| Jumlah siswa terlalu banyak                    | Beban guru meningkat                       | Optimalkan pembuatan laporan secara cepat/batch/template                  |
| Guru tetap menggunakan WhatsApp untuk feedback | Tujuan sistem tidak tercapai               | Buat feedback lebih mudah daripada membalas chat secara manual            |
| Koneksi internet orang tua/guru buruk          | Laporan atau feedback gagal dibuka/dikirim | Tampilkan pesan error yang jelas dan pastikan proses dapat dicoba kembali |
| Guru memasukkan informasi yang kurang tepat    | Orang tua menerima informasi yang salah    | Sediakan preview sebelum laporan dibagikan                                |

