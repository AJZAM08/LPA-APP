import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('teachers')
  createTeacher(@Body() dto: CreateTeacherDto) {
    return this.adminService.createTeacher(dto);
  }

  @Get('teachers')
  findAllTeachers() {
    return this.adminService.findAllTeachers();
  }

  @Delete('teachers/:id')
  deleteTeacher(@Param('id') id: string) {
    return this.adminService.deleteTeacher(id);
  }
}
