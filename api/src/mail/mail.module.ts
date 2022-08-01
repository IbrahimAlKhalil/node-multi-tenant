import { MailService } from './mail.service.js';
import { Config } from '../config/config.js';
import { createTransport } from 'nodemailer';
import { Module } from '@nestjs/common';

@Module({
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
  ],
  exports: [MailService],
})
export class MailModule {}
