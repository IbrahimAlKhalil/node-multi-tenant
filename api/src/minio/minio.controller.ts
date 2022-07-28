import { PrismaService } from '../prisma/prisma.service.js';
import { File, PrismaClient } from '../../prisma/client';
import { NotFound } from '../exceptions/not-found.js';
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
    const prisma = await this.prismaService.getPrismaOrThrow(
      req.params.instituteId,
    );

    const bucket = `qmmsoft-${req.params.instituteId}`;
    let stat: BucketItemStat;
    let file: File;

    try {
      stat = await this.minio.statObject(bucket, req.params.fileId);
      file = await prisma.file.findUniqueOrThrow({
        where: {
          id: req.params.fileId,
        },
      });
    } catch (e) {
      throw new NotFound();
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
