import { ImageMimeType, OtherMimeTypes } from './mime-type.enum.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFound } from '../exceptions/not-found.js';
import { Request, Response } from 'hyper-express';
import { Injectable } from '@nestjs/common';
import { File } from '../../prisma/client';
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

    const mimeEnums = [ImageMimeType, OtherMimeTypes];

    let contentType = 'application/octet-stream';

    for (const _enum of mimeEnums) {
      if (_enum[file.mimeTypeId]) {
        contentType = _enum[file.mimeTypeId];
        break;
      }
    }

    res.status(200).setHeaders({
      ETag: stat.etag,
      'Content-Disposition': `${
        'download' in req.query ? 'attachment' : 'inline'
      }; filename=${file.name}`,
      'Content-Type': contentType,
      'Last-Modified': `${stat.lastModified.toUTCString()}`,
      'Cache-Control': `private, max-age=2592000, immutable`,
    });

    // TODO: Support range header

    res.stream(stream, stat.size);
  }
}
