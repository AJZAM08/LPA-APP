import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';

@Injectable()
export class ClassesService {
  constructor(private prisma: PrismaService) {}

  async create(teacherId: string, dto: CreateClassDto) {
    return this.prisma.class.create({
      data: {
        teacherId,
        name: dto.name,
        gradeLevel: dto.gradeLevel,
      },
    });
  }

  async findAll(teacherId: string) {
    return this.prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: {
          select: {
            students: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(teacherId: string, id: string) {
    const cls = await this.prisma.class.findFirst({
      where: { id, teacherId },
      include: {
        students: {
          orderBy: { fullName: 'asc' },
        },
        sessions: {
          orderBy: { sessionDate: 'desc' },
          include: {
            reports: true,
          },
        },
      },
    });

    if (!cls) {
      throw new NotFoundException('Kelas tidak ditemukan');
    }

    return cls;
  }

  async remove(teacherId: string, id: string) {
    await this.findOne(teacherId, id);

    return this.prisma.class.delete({
      where: { id },
    });
  }
}
