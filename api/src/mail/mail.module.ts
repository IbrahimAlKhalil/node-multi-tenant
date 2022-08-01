import { AssetModule } from '../asset/asset.module.js';
import { MailProcessor } from './mail.processor.js';
import { MailService } from './mail.service.js';
import { Config } from '../config/config.js';
import { createTransport } from 'nodemailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
    AssetModule,
  ],
  providers: [
    {
      useFactory({ mail }: Config) {
        return createTransport({
          pool: true,
          host: mail.host,
          port: mail.port,
          auth: {
            user: mail.user,
            pass: mail.password,
          },
        });
      },
      provide: MailService,
      inject: [Config],
    },
    MailProcessor,
  ],
  exports: [MailService, BullModule],
})
export class MailModule {}
