import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubmitFeedbackDto {
  @IsOptional()
  @IsString()
  reaction?: string; // Misal: 'SENANG', 'PUAS', 'BINGUNG'

  @IsString()
  @IsNotEmpty({ message: 'Pesan tanggapan tidak boleh kosong' })
  feedbackText: string;

  @IsOptional()
  @IsString()
  homeNotes?: string;
}