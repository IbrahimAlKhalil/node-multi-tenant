import { PayloadTooLarge } from '../exceptions/payload-too-large.js';
import { ImageMimeType, OtherMimeTypes } from './mime-type.enum.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SaveOptions } from './types/save-options';
import { File, Prisma } from '../../prisma/client';
import { Institute } from '../types/institute';
import { Injectable } from '@nestjs/common';
import { fileTypeStream } from 'file-type';
import { Folder } from './folder.js';
import { Minio } from './minio.js';
import { Readable } from 'stream';

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

  async save(
    file: Readable,
    name: string,
    instituteId: string,
    options: SaveOptions = {},
  ): Promise<File> {
    const prisma = await this.prismaService.getPrismaOrThrow(instituteId);

    if (options.mimeTypes) {
      const fileWithMime = await fileTypeStream(file);

      if (!fileWithMime.fileType) {
        fileWithMime.destroy();
        throw new InputInvalid(`Cannot determine file type from input`);
      }

      const mimeTypeId = ImageMimeType[
        fileWithMime.fileType.mime as any
      ] as unknown as number;

      if (!mimeTypeId || !options.mimeTypes.has(mimeTypeId)) {
        fileWithMime.destroy();
        throw new InputInvalid(
          `File type "${fileWithMime.fileType.mime}" is not supported`,
        );
      }

      file = fileWithMime;
    }

    return prisma.$transaction(async (trx) => {
      const bucketName = `qmmsoft-${instituteId}`;

      if (typeof options.size === 'number') {
        const maxSize = options.size;
        let size = 0;

        file
          .on('data', (chunk) => {
            if ((size += chunk.length) > maxSize) {
              file.destroy(
                new PayloadTooLarge(
                  `File cannot be larger than ${maxSize} bytes`,
                ),
              );
            }
          })
          .pause();
      }

      if (options.remove) {
        await trx.file.delete({ where: { id: options.remove } });
        await this.minio.removeObject(bucketName, options.remove);
      }

      let transformerOrFile = file;

      if (options.transformer) {
        transformerOrFile = file.pipe(options.transformer);
      }

      const fileWithMime = await fileTypeStream(transformerOrFile);

      const mimeTypeId = !fileWithMime.fileType
        ? OtherMimeTypes['application/octet-stream']
        : (ImageMimeType[
            fileWithMime.fileType.mime as any
          ] as unknown as number);

      const fileData: Prisma.FileUncheckedCreateInput = {
        name: name,
        size: 0,
        mimeTypeId,
      };

      if (options.folder) {
        const folder = await trx.folder.upsert({
          where: {
            id: options.folder,
          },
          create: {
            id: options.folder,
            name: Folder[options.folder],
            internal: true,
          },
          update: {},
        });

        fileData.folderId = folder.id;
      }

      // TODO: Apply permission

      const fileInDB = await trx.file.create({
        data: fileData,
      });

      await this.minio.putObject(bucketName, fileInDB.id, fileWithMime);

      if (typeof options.beforeTrxClose === 'function') {
        await options.beforeTrxClose(trx, fileInDB);
      }

      return fileInDB;
    });
  }
}
