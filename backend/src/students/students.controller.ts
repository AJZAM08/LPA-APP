import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../auth/get-user.decorator.js';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  create(
    @GetUser('id') teacherId: string,
    @Body() dto: CreateStudentDto,
  ) {
    return this.studentsService.create(teacherId, dto);
  }

  @Get('class/:classId')
  findAllByClass(
    @GetUser('id') teacherId: string,
    @Param('classId') classId: string,
  ) {
    return this.studentsService.findAllByClass(teacherId, classId);
  }

  @Get(':id')
  findOne(
    @GetUser('id') teacherId: string,
    @Param('id') id: string,
  ) {
    return this.studentsService.findOne(teacherId, id);
  }

  @Patch(':id')
  update(
    @GetUser('id') teacherId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(teacherId, id, dto);
  }

  @Delete(':id')
  remove(
    @GetUser('id') teacherId: string,
    @Param('id') id: string,
  ) {
    return this.studentsService.remove(teacherId, id);
  }
}