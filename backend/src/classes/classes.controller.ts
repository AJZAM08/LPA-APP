import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service.js';
import { CreateClassDto } from './dto/create-class.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../auth/get-user.decorator.js';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(
    @GetUser('id') teacherId: string,
    @Body() dto: CreateClassDto,
  ) {
    return this.classesService.create(teacherId, dto);
  }

  @Get()
  findAll(@GetUser('id') teacherId: string) {
    return this.classesService.findAll(teacherId);
  }

  @Get(':id')
  findOne(
    @GetUser('id') teacherId: string,
    @Param('id') id: string,
  ) {
    return this.classesService.findOne(teacherId, id);
  }

  @Delete(':id')
  remove(
    @GetUser('id') teacherId: string,
    @Param('id') id: string,
  ) {
    return this.classesService.remove(teacherId, id);
  }
}
