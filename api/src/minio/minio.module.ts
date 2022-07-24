import { MinioController } from './minio.controller.js';
import { MinioService } from './minio.service.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import { Client } from 'minio';

@Module({
  providers: [
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
      provide: MinioService,
      inject: [Config],
    },
    MinioController,
  ],
})
export class MinioModule {}
