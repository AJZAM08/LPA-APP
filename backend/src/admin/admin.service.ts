import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async createTeacher(dto: CreateTeacherDto) {
    const existing = await this.prisma.teacher.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email guru sudah terdaftar');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const teacher = await this.prisma.teacher.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        phoneNumber: dto.phoneNumber,
        schoolName: dto.schoolName,
        role: 'TEACHER',
        isEmailVerified: false,
        isFirstLogin: true,
      },
    });

    return {
      message: 'Akun Guru berhasil dibuat oleh Admin',
      teacher: {
        id: teacher.id,
        email: teacher.email,
        fullName: teacher.fullName,
        schoolName: teacher.schoolName,
        role: teacher.role,
      },
    };
  }

  async findAllTeachers() {
    return this.prisma.teacher.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        schoolName: true,
        isEmailVerified: true,
        isFirstLogin: true,
        createdAt: true,
        _count: {
          select: {
            classes: true,
            sessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteTeacher(id: string) {
    return this.prisma.teacher.delete({
      where: { id },
    });
  }
}
