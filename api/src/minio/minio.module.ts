import { PrismaModule } from '../prisma/prisma.module.js';
import { MinioController } from './minio.controller.js';
import { MinioService } from './minio.service.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import { Minio } from './minio.js';
import { Client } from 'minio';

@Module({
  imports: [PrismaModule],
  providers: [
    MinioController,
    MinioService,
    {
      useFactory(config: Config) {
        return new Client({
          useSSL: config.minio.useSSL,
          endPoint: config.minio.endpoint,
          port: config.minio.port,
          accessKey: config.minio.username,
          secretKey: config.minio.password,
        });
      },
      provide: Minio,
      inject: [Config],
    },
  ],
  exports: [Minio, MinioService],
})
export class MinioModule {}
