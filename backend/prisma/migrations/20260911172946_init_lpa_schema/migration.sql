-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "teachers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "school_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teachers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "nickname" TEXT,
    "parent_name" TEXT,
    "parent_phone" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "session_date" DATE NOT NULL,
    "subject_topic" TEXT NOT NULL,
    "progress_notes" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PUBLISHED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_access" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "first_opened_at" TIMESTAMP(3),
    "last_opened_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "report_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_feedbacks" (
    "id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "reaction" TEXT,
    "feedback_text" TEXT NOT NULL,
    "home_notes" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_ip_hash" TEXT,

    CONSTRAINT "parent_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "teachers_email_key" ON "teachers"("email");

-- CreateIndex
CREATE INDEX "students_teacher_id_idx" ON "students"("teacher_id");

-- CreateIndex
CREATE INDEX "reports_teacher_id_student_id_idx" ON "reports"("teacher_id", "student_id");

-- CreateIndex
CREATE INDEX "reports_session_date_idx" ON "reports"("session_date");

-- CreateIndex
CREATE UNIQUE INDEX "report_access_report_id_key" ON "report_access"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_access_access_token_key" ON "report_access"("access_token");

-- CreateIndex
CREATE INDEX "report_access_access_token_idx" ON "report_access"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "parent_feedbacks_report_id_key" ON "parent_feedbacks"("report_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_access" ADD CONSTRAINT "report_access_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_feedbacks" ADD CONSTRAINT "parent_feedbacks_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;
