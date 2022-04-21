import verification from './data/verification.js';
import { Injectable } from '@nestjs/common';
import websocket from './data/websocket.js';
import postgres from './data/postgres.js';
import prisma from './data/prisma.js';
import redis from './data/redis.js';
import minio from './data/minio.js';
import auth from './data/auth.js';
import mail from './data/mail.js';
import app from './data/app.js';
import sms from './data/sms.js';

@Injectable()
export class Config {
  verification = verification();
  websocket = websocket();
  postgres = postgres();
  prisma = prisma();
  redis = redis();
  minio = minio();
  auth = auth();
  mail = mail();
  sms = sms();
  app = app();
}
