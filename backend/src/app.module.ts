import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
