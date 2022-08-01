import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService extends SMTPTransport {}
