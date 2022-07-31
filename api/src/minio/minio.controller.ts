import { ImageMimeType, OtherMimeTypes } from './mime-type.enum.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Request, Response } from 'hyper-express';
import { MinioService } from './minio.service.js';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';
import { Minio } from './minio.js';

@Injectable()
export class MinioController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
    private readonly minio: Minio,
    private readonly uws: Uws,
  ) {
    uws.get('/storage/:instituteId/:fileId', this.get.bind(this));
  }

  async get(req: Request, res: Response) {
    const file = await this.minioService.get(
      req.params.fileId,
      req.params.instituteId,
    );

    const mimeEnums = [ImageMimeType, OtherMimeTypes];

    let contentType = 'application/octet-stream';

    for (const _enum of mimeEnums) {
      if (_enum[file.fileInDB.mimeTypeId]) {
        contentType = _enum[file.fileInDB.mimeTypeId];
        break;
      }
    }

    res.status(200).setHeaders({
      ETag: file.stat.etag,
      'Content-Disposition': `${
        'download' in req.query ? 'attachment' : 'inline'
      }; filename=${file.fileInDB.name}`,
      'Content-Type': contentType,
      'Last-Modified': `${file.stat.lastModified.toUTCString()}`,
      'Cache-Control': `private, max-age=2592000, immutable`,
    });

    // TODO: Support range header

    res.stream(file.stream, file.stat.size);
  }
}
