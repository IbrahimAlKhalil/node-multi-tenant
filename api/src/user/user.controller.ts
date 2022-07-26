import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from '../auth/auth.service.js';
import { FolderEnum } from '../minio/folder.enum.js';
import { Request, Response } from 'hyper-express';
import { MimeEnum } from '../minio/mime.enum.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { fileTypeStream } from 'file-type';
import { Minio } from '../minio/minio.js';
import { Uws } from '../uws/uws.js';
import pick from 'lodash/pick.js';
import sharp from 'sharp';

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
    if (req) {
      throw new UnauthorizedException('Hello');
    }

    const session = await this.authService.authenticateReq(req, res);

    if (!session) {
      return;
    }

    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      return res.status(400).json({
        code: 'INSTITUTE_NOT_FOUND',
        message: 'Institute not found or disabled',
      });
    }

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

    if (!session) {
      return;
    }

    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      return res.status(401).json({
        code: 'INSTITUTE_NOT_FOUND',
        message: 'Institute not found or disabled',
      });
    }

    let fieldCount = 0;

    req
      .multipart(async (field) => {
        fieldCount++;

        if (fieldCount > 1) {
          res.status(400).json({
            message: 'Too many fields',
            code: 'TOO_MANY_FIELDS',
          });
          throw new Error('Too many fields');
        }

        if (!field.file || field.name !== 'file') {
          return;
        }

        let size = 0;
        const fileName = field.file.name;
        const uploadStream = field.file.stream;

        uploadStream
          .on('data', (chunk) => {
            if ((size += chunk.length) > 5e6) {
              res.status(413).json({
                message: 'File cannot be bigger than 5mb',
                code: 'PAYLOAD_TOO_LARGE',
              });

              return uploadStream.destroy();
            }
          })
          .pause();

        const streamWithFileType = await fileTypeStream(uploadStream);

        if (
          !streamWithFileType.fileType ||
          !this.supportedMimeTypes.has(streamWithFileType.fileType.mime)
        ) {
          res.status(400).json({
            code: 'INPUT_INVALID',
            message: 'File type not supported',
          });

          streamWithFileType.destroy();
          uploadStream.destroy();

          throw new Error('File type not supported');
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

        streamWithFileType.once('close', () => {
          transformer.destroy();
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
                name: 'Profile Pictures',
                internal: true,
              },
              update: {},
            });
            const fileInDB = await trx.file.create({
              data: {
                folderId: folder.id,
                name: fileName ?? 'avatar',
                size: 0,
                mimeTypeId: MimeEnum.WEBP,
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
          console.error(e);

          res.status(500).json({
            message: 'Something went wrong, please try again later',
            code: 'INTERNAL_SERVER_ERROR',
          });
        }
      })
      .then(() => {
        if (!res.completed) {
          res.status(400).json({
            message: 'Field "file" is required',
            code: 'INPUT_INVALID',
          });
        }
      })
      .catch(console.error);
  }
}
