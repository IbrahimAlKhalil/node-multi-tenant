import { PrismaService } from '../prisma/prisma.service.js';
import { SessionVars } from '../types/session-vars';
import { JwtPayload } from '../types/jwt-payload';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: Config,
  ) {}

  async authenticate(
    cookie: string,
    csrfToken: string,
  ): Promise<SessionVars | null> {
    if (!csrfToken) {
      // csrf token is not provided
      return null;
    }

    // Extract the jwt from the cookie

    const tokenKeyIndex = cookie.indexOf(`${this.config.auth.cookieKey}=`);

    if (tokenKeyIndex === -1) {
      return null;
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
      return null;
    }

    // Verify csrf token
    if (jwtPayload.cst !== csrfToken) {
      return null;
    }

    // Check token's existence in the database

    const prisma = await this.prismaService.getPrisma(jwtPayload.iid);

    if (!prisma) {
      // Institute disabled or does not exist
      return null;
    }

    const tokenExistsInDB = await prisma.accessToken.findUnique({
      where: {
        id: jwtPayload.jti,
      },
      select: {
        id: true,
      },
    });

    if (!tokenExistsInDB) {
      // Token does not exist
      return null;
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
}
