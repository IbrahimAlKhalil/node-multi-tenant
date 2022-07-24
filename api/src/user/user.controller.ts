import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from '../auth/auth.service.js';
import { Request, Response } from 'hyper-express';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';
import pick from 'lodash/pick.js';

@Injectable()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly uws: Uws,
  ) {
    uws.get('/user/me', this.me.bind(this));
  }

  private async me(req: Request, res: Response) {
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
}
