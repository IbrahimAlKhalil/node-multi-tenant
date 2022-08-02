import SMTPPool from 'nodemailer/lib/smtp-pool/index.js';
import { JobMailData } from './types/job-mail-data.js';
import Mail from 'nodemailer/lib/mailer/index.js';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailService extends Mail<SMTPPool.SentMessageInfo> {
  constructor(
    @InjectQueue('mail') public readonly queue: Queue<JobMailData>,
    private readonly config: Config,
  ) {
    const options: SMTPPool.Options = {
      pool: true,
      host: config.mail.host,
      port: config.mail.port,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    };
    const pool = new SMTPPool(options);

    super(pool, options);
  }
}
