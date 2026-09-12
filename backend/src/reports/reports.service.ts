import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClassSessionDto } from './dto/create-class-session.dto.js';
import { randomBytes } from 'node:crypto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private generateAccessToken(): string {
    return randomBytes(18)
      .toString('base64url')
      .slice(0, 24);
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.slice(1);
    }
    return cleaned;
  }

  async createSessionWithReports(
    teacherId: string,
    dto: CreateClassSessionDto,
  ) {
    const cls = await this.prisma.class.findFirst({
      where: { id: dto.classId, teacherId },
    });

    if (!cls) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    const sessionDate = new Date(dto.sessionDate);

    const session = await this.prisma.classSession.create({
      data: {
        classId: dto.classId,
        teacherId,
        sessionDate,
        dayName: dto.dayName,
        title: dto.title,
        lessonDescription: dto.lessonDescription,
      },
    });

    const createdReports = [];
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    for (const item of dto.studentReports) {
      const student = await this.prisma.student.findFirst({
        where: { id: item.studentId, classId: dto.classId },
      });

      if (!student) continue;

      const accessToken = this.generateAccessToken();

      const report = await this.prisma.report.create({
        data: {
          sessionId: session.id,
          studentId: item.studentId,
          attendance: item.attendance as any,
          activityLevel: item.activityLevel as any,
          additionalNotes: item.additionalNotes,
          recommendations: item.recommendations,
          access: {
            create: {
              accessToken,
            },
          },
        },
        include: {
          student: true,
          access: true,
        },
      });

      const publicReportUrl = `${frontendUrl}/r/${accessToken}`;

      const waText =
        `Yth. Orang Tua ${student.fullName},\n\n` +
        `Berikut kami sampaikan laporan perkembangan ananda pada pertemuan ${dto.dayName}, ${dto.sessionDate}:\n` +
        `📚 Materi: ${dto.title}\n` +
        `${publicReportUrl}\n\n` +
        `Mohon luangkan waktu 1 menit untuk membaca & mengisi catatan balik di link tersebut. Terima kasih.`;

      const formattedPhone = this.formatPhoneNumber(student.parentPhone);
      const whatsappShareUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`;

      createdReports.push({
        report,
        publicReportUrl,
        whatsappShareUrl,
        waText,
      });
    }

    return {
      message: 'Sesi kelas & laporan perkembangan murid berhasil dibuat',
      session,
      reports: createdReports,
    };
  }

  async findSessionsByClass(teacherId: string, classId: string) {
    return this.prisma.classSession.findMany({
      where: { classId, teacherId },
      orderBy: { sessionDate: 'desc' },
      include: {
        reports: {
          include: {
            student: true,
            access: true,
            feedback: true,
          },
        },
      },
    });
  }

  async findSessionDetail(teacherId: string, sessionId: string) {
    const session = await this.prisma.classSession.findFirst({
      where: { id: sessionId, teacherId },
      include: {
        class: true,
        reports: {
          include: {
            student: true,
            access: true,
            feedback: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Sesi pembelajaran tidak ditemukan');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

    const reportsWithUrls = session.reports.map((r) => {
      const publicReportUrl = r.access
        ? `${frontendUrl}/r/${r.access.accessToken}`
        : null;

      const formattedPhone = this.formatPhoneNumber(r.student.parentPhone);
      const waText =
        `Yth. Orang Tua ${r.student.fullName},\n\n` +
        `Berikut kami sampaikan laporan perkembangan ananda pada pertemuan ${session.dayName}:\n` +
        `📚 Materi: ${session.title}\n` +
        `${publicReportUrl}\n\n` +
        `Mohon luangkan waktu 1 menit untuk membaca & mengisi catatan balik di link tersebut. Terima kasih.`;

      const whatsappShareUrl = publicReportUrl
        ? `https://wa.me/${formattedPhone}?text=${encodeURIComponent(waText)}`
        : null;

      return {
        ...r,
        publicReportUrl,
        whatsappShareUrl,
      };
    });

    return {
      session,
      reports: reportsWithUrls,
    };
  }
}