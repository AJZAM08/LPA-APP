# Schema.md - Database Schema & Data Models

> **Sistem:** Laporan Perkembangan Anak (LPA)  
> **Database Dialect:** PostgreSQL 15+  
> **ORM Specification:** Prisma ORM  

---

## 1. Diagram Relasi Entitas (ERD - Entity Relationship Diagram)

```
 +--------------------+            +--------------------+
 |      teachers      | 1        * |      students      |
 +--------------------+------------+--------------------+
 | id (PK)            |            | id (PK)            |
 | email              |            | teacher_id (FK)    |
 | password_hash      |            | full_name          |
 | full_name          |            | parent_name        |
 | school_name        |            | parent_phone       |
 | created_at         |            | is_active          |
 +--------------------+            +--------------------+
           |                                  |
           | 1                                | 1
           |                                  |
           | *                                | *
 +--------------------+            +--------------------+
 | report_templates   |            |      reports       |
 +--------------------+            +--------------------+
 | id (PK)            |            | id (PK)            |
 | teacher_id (FK)    |            | student_id (FK)    |
 | title              |            | teacher_id (FK)    |
 | default_content    |            | session_date       |
 | category           |            | subject_topic      |
 +--------------------+            | progress_notes     |
                                   | recommendations    |
                                   | status             |
                                   | created_at         |
                                   +--------------------+
                                             |
                                             | 1
                                             |
                                             +--------------------+
                                             |                    |
                                             | 1                  | 1
                                             v                    v
                                   +--------------------+ +--------------------+
                                   |   report_access    | |  parent_feedbacks  |
                                   +--------------------+ +--------------------+
                                   | id (PK)            | | id (PK)            |
                                   | report_id (FK)     | | report_id (FK)     |
                                   | access_token (UQ)  | | parent_name        |
                                   | view_count         | | rating / reaction  |
                                   | first_opened_at    | | feedback_text      |
                                   | last_opened_at     | | home_notes         |
                                   | is_active          | | submitted_at       |
                                   +--------------------+ +--------------------+
```

---

## 2. Definisi Struktur Tabel (Data Dictionaries)

### 2.1 Tabel `teachers` (Data Akun Guru)
Menyimpan identitas guru yang mengelola data siswa dan laporan.

| Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identifikasi unik guru |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL` | Email untuk login guru |
| `password_hash`| `VARCHAR(255)` | `NOT NULL` | Hash password (Argon2id/Bcrypt) |
| `full_name` | `VARCHAR(150)` | `NOT NULL` | Nama lengkap guru |
| `phone_number` | `VARCHAR(20)` | `NULLABLE` | Nomor WhatsApp guru |
| `school_name` | `VARCHAR(200)` | `NULLABLE` | Nama sekolah / institusi bimbel |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu pembuatan akun |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu update terakhir |

### 2.2 Tabel `students` (Data Murid)
Menyimpan informasi murid binaan dan kontak orang tua.

| Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | ID unik siswa |
| `teacher_id` | `UUID` | `NOT NULL, FK -> teachers(id) ON DELETE CASCADE` | Guru pembimbing |
| `full_name` | `VARCHAR(150)` | `NOT NULL` | Nama lengkap anak |
| `nickname` | `VARCHAR(50)` | `NULLABLE` | Nama panggilan anak |
| `parent_name` | `VARCHAR(150)` | `NULLABLE` | Nama orang tua / wali |
| `parent_phone` | `VARCHAR(20)` | `NOT NULL` | Nomor WhatsApp orang tua (format E.164) |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Status aktif siswa di kelas |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu pendaftaran siswa |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu update siswa |

### 2.3 Tabel `reports` (Laporan Pembelajaran)
Dokumen inti laporan perkembangan setiap sesi/pertemuan.

| Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | ID unik laporan |
| `teacher_id` | `UUID` | `NOT NULL, FK -> teachers(id) ON DELETE CASCADE` | Pembuat laporan |
| `student_id` | `UUID` | `NOT NULL, FK -> students(id) ON DELETE CASCADE` | Siswa penerima |
| `session_date` | `DATE` | `NOT NULL, DEFAULT CURRENT_DATE` | Tanggal sesi pembelajaran |
| `subject_topic`| `VARCHAR(255)` | `NOT NULL` | Materi/Topik yang dipelajari |
| `progress_notes`| `TEXT` | `NOT NULL` | Uraian perkembangan anak selama sesi |
| `recommendations`| `TEXT` | `NOT NULL` | Catatan dan latihan untuk di rumah |
| `status` | `VARCHAR(20)` | `DEFAULT 'PUBLISHED'` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu pembuatan laporan |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu update terakhir |

### 2.4 Tabel `report_access` (Akses Token Publik)
Mengelola token rahasia URL untuk konsumsi orang tua tanpa login.

| Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | ID unik record token |
| `report_id` | `UUID` | `UNIQUE, NOT NULL, FK -> reports(id) ON DELETE CASCADE` | 1 token per 1 laporan |
| `access_token` | `VARCHAR(64)` | `UNIQUE, NOT NULL` | Random URL-safe string (24-32 chars) |
| `view_count` | `INTEGER` | `DEFAULT 0` | Berapa kali link dibuka |
| `first_opened_at`| `TIMESTAMPTZ`| `NULLABLE` | Pertama kali link dibuka orang tua |
| `last_opened_at` | `TIMESTAMPTZ`| `NULLABLE` | Terakhir kali link dibuka orang tua |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Opsi revoke link bila ada kesalahan |
| `expires_at` | `TIMESTAMPTZ` | `NULLABLE` | Masa berlaku link (default null: no expiry) |

### 2.5 Tabel `parent_feedbacks` (Feedback Orang Tua)
Menyimpan tanggapan dua arah dari orang tua murid.

| Kolom | Tipe Data | Constraint | Keterangan |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | ID unik feedback |
| `report_id` | `UUID` | `UNIQUE, NOT NULL, FK -> reports(id) ON DELETE CASCADE` | 1 feedback per 1 laporan (v1) |
| `reaction` | `VARCHAR(20)` | `NULLABLE` | Pilihan mood emoji/reaksi (e.g. `SENANG`, `PUAS`, `BINGUNG`) |
| `feedback_text`| `TEXT` | `NOT NULL` | Komentar atau respon orang tua |
| `home_notes` | `TEXT` | `NULLABLE` | Catatan perkembangan anak di rumah |
| `submitted_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Waktu kirim feedback |
| `client_ip_hash`| `VARCHAR(64)` | `NULLABLE` | Hash SHA-256 IP address untuk audit/spam pencegahan |

---

## 3. Prisma Schema Implementation File (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ReportStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Teacher {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  fullName     String    @map("full_name")
  phoneNumber  String?   @map("phone_number")
  schoolName   String?   @map("school_name")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  students     Student[]
  reports      Report[]

  @@map("teachers")
}

model Student {
  id          String    @id @default(uuid())
  teacherId   String    @map("teacher_id")
  fullName    String    @map("full_name")
  nickname    String?
  parentName  String?   @map("parent_name")
  parentPhone String    @map("parent_phone")
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  teacher     Teacher   @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  reports     Report[]

  @@index([teacherId])
  @@map("students")
}

model Report {
  id              String         @id @default(uuid())
  teacherId       String         @map("teacher_id")
  studentId       String         @map("student_id")
  sessionDate     DateTime       @db.Date @map("session_date")
  subjectTopic    String         @map("subject_topic")
  progressNotes   String         @map("progress_notes")
  recommendations String
  status          ReportStatus   @default(PUBLISHED)
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  teacher         Teacher        @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  student         Student        @relation(fields: [studentId], references: [id], onDelete: Cascade)
  access          ReportAccess?
  feedback        ParentFeedback?

  @@index([teacherId, studentId])
  @@index([sessionDate])
  @@map("reports")
}

model ReportAccess {
  id            String    @id @default(uuid())
  reportId      String    @unique @map("report_id")
  accessToken   String    @unique @map("access_token")
  viewCount     Int       @default(0) @map("view_count")
  firstOpenedAt DateTime? @map("first_opened_at")
  lastOpenedAt  DateTime? @map("last_opened_at")
  isActive      Boolean   @default(true) @map("is_active")
  expiresAt     DateTime? @map("expires_at")

  report        Report    @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@index([accessToken])
  @@map("report_access")
}

model ParentFeedback {
  id           String    @id @default(uuid())
  reportId     String    @unique @map("report_id")
  reaction     String?
  feedbackText String    @map("feedback_text")
  homeNotes    String?   @map("home_notes")
  submittedAt  DateTime  @default(now()) @map("submitted_at")
  clientIpHash String?   @map("client_ip_hash")

  report       Report    @relation(fields: [reportId], references: [id], onDelete: Cascade)

  @@map("parent_feedbacks")
}
```
