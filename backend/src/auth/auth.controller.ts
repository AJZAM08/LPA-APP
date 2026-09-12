import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { GetUser } from './get-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('verify-first-login')
  @UseGuards(JwtAuthGuard)
  verifyFirstLogin(
    @GetUser('id') userId: string,
    @Body('newPassword') newPassword?: string,
  ) {
    return this.authService.verifyFirstLogin(userId, newPassword);
  }
}