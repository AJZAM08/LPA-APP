import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AdminModule } from './admin/admin.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { StudentsModule } from './students/students.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { PublicModule } from './public/public.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

const appKey = process.env.OBSERVE_APP_KEY;
const appSecret = process.env.OBSERVE_APP_SECRET;

if (!appKey || !appSecret) {
  throw new Error('Missing Observe API key or secret');
}

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey,
      appSecret,
      serviceId: 'backend',
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    ClassesModule,
    StudentsModule,
    ReportsModule,
    PublicModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
