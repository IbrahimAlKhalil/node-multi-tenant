import { PrismaService } from '../prisma/prisma.service.js';
import { HttpResponse, HttpRequest } from 'uWebSockets.js';
import { UwsService } from '../uws/uws.service.js';
import { JwtPayload } from '../types/jwt-payload';
import { user_kind } from '../../prisma/client';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Session } from '../types/session';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly uwsService: UwsService,
    private readonly jwtService: JwtService,
    private readonly config: Config,
  ) {}

  async authenticate(
    cookie: string,
    csrfToken: string,
    instituteId?: string,
  ): Promise<Session | null> {
    if (!csrfToken || !cookie) {
      // csrf token is not provided

      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    // Extract the jwt from the cookie

    const tokenKeyIndex = cookie.indexOf(`${this.config.auth.cookieKey}=`);

    if (tokenKeyIndex === -1) {
      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    const boundary = cookie.indexOf(';', tokenKeyIndex);
    const token = cookie.slice(
      tokenKeyIndex + this.config.auth.cookieKey.length + 1,
      boundary === -1 ? cookie.length : boundary,
    );

    // Verify the jwt

    let jwtPayload: JwtPayload;

    try {
      jwtPayload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch (e) {
      // Invalid jwt
      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    // Check token's existence in the database

    const prisma = await this.prismaService.getPrisma(jwtPayload.iid);

    if (!prisma) {
      // Institute disabled or does not exist
      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    const tokenExistsInDB = await prisma.accessToken.findFirst({
      where: {
        id: jwtPayload.jti,
        csrfToken,
      },
      select: {
        id: true,
      },
    });

    if (!tokenExistsInDB) {
      // Token does not exist
      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    // Everything is fine

    return {
      iid: jwtPayload.iid,
      uid: jwtPayload.uid,
      knd: jwtPayload.knd,
      rol: jwtPayload.rol,
      jti: jwtPayload.jti,
    };
  }

  async authenticateReq<
    A = false,
    S = A extends true | undefined ? Session : Session<user_kind>,
  >(res: HttpResponse, req: HttpRequest, allowPublic?: A): Promise<S | null> {
    const cookie = req.getHeader('cookie');
    const csrfToken = req.getHeader('x-csrf-token');
    const origin = req.getHeader('origin');
    const instituteId = req.getHeader('x-qm-institute-id');

    const session = await this.authenticate(cookie, csrfToken, instituteId);

    if (!session || (!allowPublic && session.knd === 'PUBLIC')) {
      res.writeStatus('401');

      res.cork(() => {
        this.uwsService
          .setCorsHeaders(res, origin, false)
          .writeHeader('Content-Type', 'application/json')
          .end(
            JSON.stringify({
              code: 'UNAUTHORIZED',
              error: 'You are not authorized to make this request',
            }),
            true,
          );
      });
    }

    return session as S | null;
  }
}
