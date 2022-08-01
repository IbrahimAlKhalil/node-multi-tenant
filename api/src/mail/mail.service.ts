// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Transport from 'nodemailer/lib/smtp-transport/index.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService extends (Transport as typeof SMTPTransport) {}
