import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateStudentDto) {
    const cls = await this.prisma.class.findFirst({
      where: { id: dto.classId, teacherId },
    });

    if (!cls) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    return this.prisma.student.create({
      data: {
        classId: dto.classId,
        fullName: dto.fullName,
        nickname: dto.nickname,
        parentName: dto.parentName,
        parentPhone: dto.parentPhone,
      },
    });
  }

  async findAllByClass(teacherId: string, classId: string) {
    const cls = await this.prisma.class.findFirst({
      where: { id: classId, teacherId },
    });

    if (!cls) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    return this.prisma.student.findMany({
      where: { classId },
      orderBy: { fullName: 'asc' },
      include: {
        _count: {
          select: { reports: true },
        },
      },
    });
  }

  async findOne(teacherId: string, id: string) {
    const student = await this.prisma.student.findFirst({
      where: { id, class: { teacherId } },
      include: {
        class: true,
        reports: {
          orderBy: { createdAt: 'desc' },
          include: {
            session: true,
            access: true,
            feedback: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Data siswa tidak ditemukan');
    }

    return student;
  }

  async update(teacherId: string, id: string, dto: UpdateStudentDto) {
    await this.findOne(teacherId, id);

    return this.prisma.student.update({
      where: { id },
      data: dto,
    });
  }

  async remove(teacherId: string, id: string) {
    await this.findOne(teacherId, id);

    return this.prisma.student.delete({
      where: { id },
    });
  }
}