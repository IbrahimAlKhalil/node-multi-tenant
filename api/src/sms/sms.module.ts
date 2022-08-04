import { Module } from '@nestjs/common';
import { SmsService } from './sms.service.js';

@Module({
  imports: [SmsService],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
