import { PrismaService } from '../prisma/prisma.service.js';
import { File, PrismaClient } from '../../prisma/client';
import { Request, Response } from 'hyper-express';
import { MimeTypeMap } from './mime.enum.js';
import { Injectable } from '@nestjs/common';
import { BucketItemStat } from 'minio';
import { Uws } from '../uws/uws.js';
import { Minio } from './minio.js';

@Injectable()
export class MinioController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minio: Minio,
    private readonly uws: Uws,
  ) {
    uws.get('/storage/:instituteId/:fileId', this.get.bind(this));
  }

  async get(req: Request, res: Response) {
    const bucket = `qmmsoft-${req.params.instituteId}`;

    let stat: BucketItemStat;
    let prisma: PrismaClient;
    let file: File;

    try {
      const _prisma = await this.prismaService.getPrisma(
        req.params.instituteId,
      );

      if (!_prisma) {
        throw new Error('Institute Not found');
      }

      prisma = _prisma;

      stat = await this.minio.statObject(bucket, req.params.fileId);
      file = await prisma.file.findUniqueOrThrow({
        where: {
          id: req.params.fileId,
        },
      });
    } catch (e) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'The file you are looking for cannot found',
      });
    }

    const stream = await this.minio.getObject(bucket, req.params.fileId);

    res.status(200).setHeaders({
      ETag: stat.etag,
      'Content-Disposition': `${
        'download' in req.query ? 'attachment' : 'inline'
      }; filename=${file.name}`,
      'Content-Type': MimeTypeMap[file.mimeTypeId],
      'Last-Modified': `${stat.lastModified.toUTCString()}`,
      'Cache-Control': `private, max-age=2592000, immutable`,
    });

    // TODO: Support range header

    res.stream(stream, stat.size);
  }
}
