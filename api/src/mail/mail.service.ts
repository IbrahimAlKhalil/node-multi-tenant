import Mail from 'nodemailer/lib/mailer/index.js';
import SMTPPool from 'nodemailer/lib/smtp-pool';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService extends Mail<SMTPPool.SentMessageInfo> {}
