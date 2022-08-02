import { AssetModule } from '../asset/asset.module.js';
import { MailProcessor } from './mail.processor.js';
import { MailService } from './mail.service.js';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
    AssetModule,
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService, BullModule],
})
export class MailModule {}
