import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty({ message: 'Siswa harus dipilih' })
  studentId: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal tidak valid' })
  sessionDate?: string;

  @IsString()
  @IsNotEmpty({ message: 'Materi/Topik tidak boleh kosong' })
  subjectTopic: string;

  @IsString()
  @IsNotEmpty({ message: 'Catatan perkembangan tidak boleh kosong' })
  progressNotes: string;

  @IsString()
  @IsNotEmpty({ message: 'Saran & rekomendasi di rumah tidak boleh kosong' })
  recommendations: string;
}