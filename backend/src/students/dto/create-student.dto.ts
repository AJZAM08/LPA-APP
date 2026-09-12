import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'Kelas harus dipilih' })
  classId: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap anak tidak boleh kosong' })
  fullName: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp orang tua tidak boleh kosong' })
  parentPhone: string;
}