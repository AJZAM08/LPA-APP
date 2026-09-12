import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto.js';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getPublicReport(accessToken: string) {
    const access = await this.prisma.reportAccess.findUnique({
      where: { accessToken },
      include: {
        report: {
          include: {
            student: {
              include: {
                class: true,
              },
            },
            session: {
              include: {
                teacher: {
                  select: {
                    fullName: true,
                    schoolName: true,
                  },
                },
              },
            },
            feedback: true,
          },
        },
      },
    });

    if (!access || !access.isActive) {
      throw new NotFoundException('Laporan tidak ditemukan atau link sudah tidak aktif');
    }

    const now = new Date();

    await this.prisma.reportAccess.update({
      where: { id: access.id },
      data: {
        viewCount: { increment: 1 },
        firstOpenedAt: access.firstOpenedAt || now,
        lastOpenedAt: now,
      },
    });

    const report = access.report;

    return {
      studentName: report.student.fullName,
      studentNickname: report.student.nickname,
      className: report.student.class.name,
      teacherName: report.session.teacher.fullName,
      schoolName: report.session.teacher.schoolName,
      sessionDate: report.session.sessionDate,
      dayName: report.session.dayName,
      subjectTitle: report.session.title,
      lessonDescription: report.session.lessonDescription,
      attendance: report.attendance,
      activityLevel: report.activityLevel,
      additionalNotes: report.additionalNotes,
      recommendations: report.recommendations,
      feedback: report.feedback,
    };
  }

  async submitFeedback(accessToken: string, dto: SubmitFeedbackDto) {
    const access = await this.prisma.reportAccess.findUnique({
      where: { accessToken },
      include: { report: true },
    });

    if (!access || !access.isActive) {
      throw new NotFoundException('Laporan tidak ditemukan atau link sudah tidak aktif');
    }

    const existingFeedback = await this.prisma.parentFeedback.findUnique({
      where: { reportId: access.reportId },
    });

    if (existingFeedback) {
      throw new BadRequestException('Tanggapan untuk laporan ini sudah pernah dikirimkan sebelumnya');
    }

    const feedback = await this.prisma.parentFeedback.create({
      data: {
        reportId: access.reportId,
        reaction: dto.reaction,
        feedbackText: dto.feedbackText,
        homeNotes: dto.homeNotes,
      },
    });

    return {
      message: 'Terima kasih! Tanggapan Anda telah terkirim langsung ke guru.',
      feedback,
    };
  }
}