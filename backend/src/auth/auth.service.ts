import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const adminCount = await this.prisma.teacher.count({
      where: { role: 'SUPER_ADMIN' },
    });

    if (adminCount === 0) {
      const passwordHash = await bcrypt.hash('admin123456', 10);
      await this.prisma.teacher.create({
        data: {
          email: 'admin@sekolah.id',
          passwordHash,
          fullName: 'Super Admin LPA',
          role: 'SUPER_ADMIN',
          isEmailVerified: true,
          isFirstLogin: false,
        },
      });
      console.log('✅ Default Super Admin created: admin@sekolah.id / admin123456');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.teacher.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: 'Login berhasil',
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        schoolName: user.schoolName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isFirstLogin: user.isFirstLogin,
      },
    };
  }

  async verifyFirstLogin(userId: string, newPassword?: string) {
    const dataToUpdate: any = {
      isFirstLogin: false,
      isEmailVerified: true,
    };

    if (newPassword) {
      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const user = await this.prisma.teacher.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return {
      message: 'Verifikasi akun guru berhasil',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isFirstLogin: user.isFirstLogin,
      },
    };
  }

  private generateToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }
}