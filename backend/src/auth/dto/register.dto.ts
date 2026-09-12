import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: 'Format email tidak valid' })
    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password minimal 8 karakter' })
    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
    fullName: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    schoolName?: string;
}