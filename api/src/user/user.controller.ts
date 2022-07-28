import { InternalServerError } from '../exceptions/internal-server-error.js';
import { PayloadTooLarge } from '../exceptions/payload-too-large.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from '../auth/auth.service.js';
import { FolderEnum } from '../minio/folder.enum.js';
import { Request, Response } from 'hyper-express';
import { MimeIdEnum } from '../minio/mime.enum.js';
import { Injectable } from '@nestjs/common';
import { fileTypeStream } from 'file-type';
import { Minio } from '../minio/minio.js';
import { Uws } from '../uws/uws.js';
import pick from 'lodash/pick.js';
import sharp from 'sharp';
import path from 'path';

@Injectable()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly minio: Minio,
    private readonly uws: Uws,
  ) {
    uws.get('/user/me', this.me.bind(this));
    uws.post('/user/avatar', this.uploadAvatar.bind(this));
  }

  private readonly supportedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
  ]);

  private async me(req: Request, res: Response) {
    const session = await this.authService.authenticateReq(req, res);
    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);

    const user = await prisma.user.findUnique({
      where: {
        id: session.uid,
      },
      select: {
        id: true,
        email: true,
        username: true,
        pictureId: true,
        type: true,

        I18n: {
          select: {
            name: true,
          },
          take: 1,
        },
      },
    });

    const userDecorated: Record<string, any> = pick(
      user,
      'id',
      'email',
      'username',
      'pictureId',
      'type',
    );

    userDecorated.name = user?.I18n?.[0]?.name;

    res.status(200).json(userDecorated);
  }

  private async uploadAvatar(req: Request, res: Response) {
    const session = await this.authService.authenticateReq(req, res);
    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);

    let fieldCount = 0;

    req
      .multipart(async (field) => {
        fieldCount++;

        if (fieldCount > 1) {
          throw new InputInvalid('Too many fields');
        }

        if (!field.file || field.name !== 'file') {
          return;
        }

        let size = 0;
        const fileName = field.file.name
          ? path.parse(field.file.name).name
          : 'avatar';
        const uploadStream = field.file.stream;

        uploadStream
          .on('data', (chunk) => {
            if ((size += chunk.length) > 5e6) {
              uploadStream.destroy();
              throw new PayloadTooLarge(
                'File cannot be larger than 5 Megabytes',
              );
            }
          })
          .pause();

        const streamWithFileType = await fileTypeStream(uploadStream);

        if (
          !streamWithFileType.fileType ||
          !this.supportedMimeTypes.has(streamWithFileType.fileType.mime)
        ) {
          streamWithFileType.destroy();
          uploadStream.destroy();

          throw new InputInvalid('File type not supported');
        }

        const transformer = sharp()
          .resize({
            width: 1000,
            height: 1000,
            withoutEnlargement: true,
          })
          .webp({
            quality: 30,
            alphaQuality: 30,
          });

        try {
          await prisma.$transaction(async (trx) => {
            const bucketName = `qmmsoft-${session.iid}`;
            const user = await trx.user.findUniqueOrThrow({
              where: {
                id: session.uid,
              },
              select: {
                pictureId: true,
              },
            });

            if (user.pictureId) {
              await this.minio.removeObject(bucketName, user.pictureId);
              await trx.file.delete({ where: { id: user.pictureId } });
            }

            const folder = await trx.folder.upsert({
              where: {
                id: FolderEnum.PROFILE_PICTURE,
              },
              create: {
                id: FolderEnum.PROFILE_PICTURE,
                name: 'Avatars',
                internal: true,
              },
              update: {},
            });
            const fileInDB = await trx.file.create({
              data: {
                folderId: folder.id,
                name: `${fileName}.webp`,
                size: 0,
                mimeTypeId: MimeIdEnum.WEBP,
                ProfilePictureUsers: {
                  connect: {
                    id: session.uid,
                  },
                },
              },
            });

            await this.minio.putObject(
              bucketName,
              fileInDB.id,
              streamWithFileType.pipe(transformer),
            );

            res.status(201).json(fileInDB);
          });
        } catch (e) {
          throw new InternalServerError(e.message);
        }
      })
      .then(() => {
        if (!res.completed) {
          throw new InputInvalid('Field "file" is required');
        }
      });
  }
}
