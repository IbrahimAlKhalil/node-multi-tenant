import { MinioController } from './minio.controller.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import { Minio } from './minio.js';
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
      provide: Minio,
      inject: [Config],
    },
    MinioController,
  ],
  exports: [Minio],
})
export class MinioModule {}
