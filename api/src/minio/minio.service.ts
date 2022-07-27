import { PrismaService } from '../prisma/prisma.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Institute } from '../types/institute';
import { Injectable } from '@nestjs/common';
import { Minio } from './minio.js';

@Injectable()
export class MinioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly emitter: EventEmitter2,
    private readonly minio: Minio,
  ) {
    emitter.once('institute.loaded', async (institutes: Institute[]) => {
      for (const institute of institutes) {
        const bucketName = `qmmsoft-${institute.id}`;

        if (await this.minio.bucketExists(bucketName)) {
          continue;
        }

        await this.minio.makeBucket(bucketName, 'ap-southeast-1');
      }

      return institutes;
    });
  }
}
