import { VerificationController } from './verification.controller.js';
import { HelperModule } from '../helper/helper.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ConfigModule } from '../config/config.module.js';
import { QueryModule } from '../query/query.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';
import { SmsModule } from '../sms/sms.module.js';
import { UwsModule } from '../uws/uws.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    HelperModule,
    QueryModule,
    MailModule,
    AuthModule,
    SmsModule,
    UwsModule,
    ConfigModule,
  ],
  providers: [VerificationController],
})
export class VerificationModule {}
