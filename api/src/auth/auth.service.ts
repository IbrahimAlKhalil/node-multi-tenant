import { PrismaService } from '../prisma/prisma.service.js';
import { JwtPayload } from '../types/jwt-payload';
import { Request, Response } from 'hyper-express';
import { user_kind } from '../../prisma/client';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Session } from '../types/session';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: Config,
  ) {}

  async authenticate(
    accessToken: string,
    csrfToken: string,
    instituteId?: string,
  ): Promise<Session | null> {
    if (!csrfToken || !accessToken) {
      // csrf token is not provided

      if (!instituteId) {
        return null;
      }

      return {
        knd: 'PUBLIC',
        iid: instituteId,
      };
    }

    // Verify the jwt

    let jwtPayload: JwtPayload;

    try {
      jwtPayload = await this.jwtService.verifyAsync<JwtPayload>(accessToken);
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
  >(req: Request, res: Response, allowPublic?: A): Promise<S | null> {
    const csrfToken = req.header('x-csrf-token');
    const instituteId = req.header('x-qm-institute-id');

    const session = await this.authenticate(
      req.cookies[this.config.auth.cookieKey],
      csrfToken,
      instituteId,
    );

    if (!session || (!allowPublic && session.knd === 'PUBLIC')) {
      res.status(401).json({
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to make this request',
      });
    }

    return session as S | null;
  }
}
