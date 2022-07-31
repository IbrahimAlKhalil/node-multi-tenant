import { changePasswordSchema } from './schema/change-password.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ImageMimeType } from '../minio/mime-type.enum.js';
import { SaveOptions } from '../minio/types/save-options';
import { MinioService } from '../minio/minio.service.js';
import { QueryService } from '../query/query.service.js';
import { NotFound } from '../exceptions/not-found.js';
import { AuthService } from '../auth/auth.service.js';
import { Request, Response } from 'hyper-express';
import { Injectable } from '@nestjs/common';
import { Folder } from '../minio/folder.js';
import { Minio } from '../minio/minio.js';
import { Uws } from '../uws/uws.js';
import pick from 'lodash/pick.js';
import argon2 from 'argon2';
import sharp from 'sharp';
import path from 'path';

@Injectable()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minioService: MinioService,
    private readonly queryService: QueryService,
    private readonly authService: AuthService,
    private readonly minio: Minio,
    private readonly uws: Uws,
  ) {
    uws.get('/user/me', this.me.bind(this));
    uws.post('/user/avatar', this.uploadAvatar.bind(this));
    uws.post('/user/change-password', this.changePassword.bind(this));
  }

  private readonly supportedMimeTypes = new Set<ImageMimeType>(
    Object.values(ImageMimeType).filter((v) => !isNaN(Number(v))) as number[],
  );

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

  private async changePassword(req: Request, res: Response) {
    const session = await this.authService.authenticateReq(req, res);
    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);

    // Validate user input
    const { error, value } = changePasswordSchema.validate(await req.json(), {
      convert: true,
    });

    if (error) {
      // Validation failed
      throw new InputInvalid(error.message, error.details);
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { id: session.uid } });

    if (
      !user ||
      user.disabled ||
      !user.password ||
      !(await argon2.verify(user.password, value.oldPassword))
    ) {
      throw new InputInvalid('Incorrect password');
    }

    const hash = await argon2.hash(value.newPassword);

    if (value.userId) {
      try {
        await this.queryService.mutate(
          {
            type: 'update',
            model: 'user',
            query: {
              where: {
                id: value.userId,
              },
              data: {
                password: hash,
              },
            },
          },
          session,
        );
      } catch (error) {
        throw new NotFound('User not found');
      }
    } else {
      await prisma.user.update({
        where: {
          id: session.uid,
        },
        data: {
          password: hash,
        },
      });
    }

    res.status(200).json({ success: true });
  }

  private async uploadAvatar(req: Request, res: Response) {
    const session = await this.authService.authenticateReq(req, res);
    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);

    let fieldCount = 0;

    try {
      await req.multipart(async (field) => {
        if (res.completed) {
          return;
        }

        if (++fieldCount > 1) {
          throw new InputInvalid(
            'The "file" field must be the first field of the request body',
          );
        }

        if (!field.file || field.name !== 'file') {
          return;
        }

        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: session.uid,
          },
          select: {
            pictureId: true,
          },
        });

        const fileName = field.file.name
          ? path.parse(field.file.name).name
          : 'avatar';

        const transformer = sharp()
          .resize({
            width: 1200,
            height: 1200,
            withoutEnlargement: true,
          })
          .webp({
            quality: 30,
            alphaQuality: 30,
          });

        const beforeTrxClose: SaveOptions['beforeTrxClose'] = (
          trx,
          fileInDB,
        ) => {
          return trx.user.update({
            where: {
              id: session.uid,
            },
            data: {
              pictureId: fileInDB.id,
            },
          });
        };

        const file = await this.minioService.save(
          field.file.stream,
          fileName,
          session.iid,
          {
            folder: Folder.Avatars,
            remove: user.pictureId,
            mimeTypes: this.supportedMimeTypes,
            size: 5e6,
            transformer,
            beforeTrxClose,
          },
        );

        res.status(201).json(file);
      });
    } catch (e) {
      // Rethrow
      throw e;
    }
  }
}
