import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum AttendanceStatus {
  HADIR = 'HADIR',
  IZIN = 'IZIN',
  SAKIT = 'SAKIT',
  ALPA = 'ALPA',
}

export enum ActivityLevel {
  SANGAT_AKTIF = 'SANGAT_AKTIF',
  AKTIF = 'AKTIF',
  CUKUP = 'CUKUP',
  PASIF = 'PASIF',
}

export class StudentReportInputDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsEnum(AttendanceStatus)
  attendance: AttendanceStatus;

  @IsEnum(ActivityLevel)
  activityLevel: ActivityLevel;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;
}

export class CreateClassSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'Kelas harus dipilih' })
  classId: string;

  @IsString()
  @IsNotEmpty({ message: 'Tanggal sesi pembelajaran harus diisi' })
  sessionDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama hari harus diisi' })
  dayName: string;

  @IsString()
  @IsNotEmpty({ message: 'Judul materi harus diisi' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi pembelajaran harus diisi' })
  lessonDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentReportInputDto)
  studentReports: StudentReportInputDto[];
}
