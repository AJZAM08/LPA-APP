import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @IsOptional()
  @IsString()
  subjectTopic?: string;

  @IsOptional()
  @IsString()
  progressNotes?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;
}