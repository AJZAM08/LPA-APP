import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { CreateClassSessionDto } from './dto/create-class-session.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../auth/get-user.decorator.js';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('session')
  createSessionWithReports(
    @GetUser('id') teacherId: string,
    @Body() dto: CreateClassSessionDto,
  ) {
    return this.reportsService.createSessionWithReports(teacherId, dto);
  }

  @Get('class/:classId/sessions')
  findSessionsByClass(
    @GetUser('id') teacherId: string,
    @Param('classId') classId: string,
  ) {
    return this.reportsService.findSessionsByClass(teacherId, classId);
  }

  @Get('session/:sessionId')
  findSessionDetail(
    @GetUser('id') teacherId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.reportsService.findSessionDetail(teacherId, sessionId);
  }
}