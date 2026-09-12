import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama kelas tidak boleh kosong' })
  name: string;

  @IsOptional()
  @IsString()
  gradeLevel?: string;
}
