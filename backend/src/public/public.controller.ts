import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PublicService } from './public.service.js';
import { SubmitFeedbackDto } from './dto/submit-feedback.dto.js';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // Ortu membaca laporan via access_token
  @Get('reports/:accessToken')
  getPublicReport(@Param('accessToken') accessToken: string) {
    return this.publicService.getPublicReport(accessToken);
  }

  // Ortu mengirim feedback via access_token
  @Post('reports/:accessToken/feedback')
  submitFeedback(
    @Param('accessToken') accessToken: string,
    @Body() dto: SubmitFeedbackDto,
  ) {
    return this.publicService.submitFeedback(accessToken, dto);
  }
}