// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService extends SMTPTransport {}
