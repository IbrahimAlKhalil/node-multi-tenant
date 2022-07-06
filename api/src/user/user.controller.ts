import { PrismaService } from '../prisma/prisma.service.js';
import { HttpRequest, HttpResponse } from 'uWebSockets.js';
import { AuthService } from '../auth/auth.service.js';
import { UwsService } from '../uws/uws.service.js';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';
import pick from 'lodash/pick.js';

@Injectable()
export class UserController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly uwsService: UwsService,
    private readonly uws: Uws,
  ) {
    uws.get('/user/me', this.me.bind(this));
    uws.options('/user/me', uwsService.setCorsHeaders.bind(uwsService));
  }

  private async me(res: HttpResponse, req: HttpRequest) {
    let aborted = false;

    res.onAborted(() => {
      aborted = true;
    });

    const origin = req.getHeader('origin');

    const session = await this.authService.authenticateReq(res, req);

    if (aborted || !session) {
      return;
    }

    const prisma = await this.prismaService.getPrisma(session.iid);

    if (!prisma) {
      res.writeStatus('400');

      return res.cork(() => {
        this.uwsService
          .setCorsHeaders(res, origin, false)
          .writeHeader('Content-Type', 'application/json')
          .end(
            JSON.stringify({
              code: 'INSTITUTE_NOT_FOUND',
              message: 'Institute not found or disabled',
            }),
            true,
          );
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

    res.cork(() => {
      this.uwsService
        .setCorsHeaders(res, origin, false)
        .writeHeader('Content-Type', 'application/json')
        .end(JSON.stringify(userDecorated), true);
    });
  }
}
