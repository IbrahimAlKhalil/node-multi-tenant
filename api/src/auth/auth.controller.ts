import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HelperService } from '../helper/helper.service.js';
import { Unauthorized } from './exceptions/unauthorized.js';
import { NotFound } from '../exceptions/not-found.js';
import { JwtPayload } from '../types/jwt-payload';
import { Request, Response } from 'hyper-express';
import { LoginInput } from './types/login-input';
import { AuthService } from './auth.service.js';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Uws } from '../uws/uws.js';
import argon2 from 'argon2';
import joi from 'joi';

@Injectable()
export class AuthController {
  constructor(
    private readonly helperService: HelperService,
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    uws.post('/auth/login', this.login.bind(this));
    uws.get('/auth/authenticate', this.authenticate.bind(this));
  }

  private readonly loginSchema = joi.object<LoginInput>({
    code: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().required(),
    rememberMe: joi.boolean().default(false),
  });

  private async authenticate(req: Request, res: Response): Promise<void> {
    const session = await this.authService.authenticateReq(req, res);

    if (!session) return;

    res.status(200).json(session);
  }

  private async login(req: Request, res: Response): Promise<void> {
    // Extract necessary data from request before calling any async functions;
    const ipAddress = req.ip;
    const userAgent = req.header('user-agent');

    // Validate user input
    const { error, value } = this.loginSchema.validate(await req.json(), {
      convert: true,
    });

    if (error) {
      // Validation failed
      throw new InputInvalid(error.message, error.details);
    }

    const identity = this.helperService.getIdentityType(value.username);
    const prisma = await this.prismaService.getPrismaOrThrow(value.code);

    const user = await prisma.user.findUnique({
      where: {
        [identity.type]: identity.value,
      },
    });

    if (
      !user ||
      user.disabled ||
      !user.password ||
      !(await argon2.verify(user.password, value.password))
    ) {
      throw new Unauthorized('Username or password is incorrect');
    }

    // User is valid, so we can create a jwt token

    const expiresAt = value.rememberMe
      ? new Date(Date.now() + this.config.auth.longTokenLifetime)
      : new Date(Date.now() + this.config.auth.shortTokenLifetime);
    const csrfToken = await this.helperService.generateRandomString(
      this.config.auth.csrfTokenLength,
    );

    const accessToken = await prisma.accessToken.create({
      data: {
        userId: user.id,
        csrfToken,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    const roles = await prisma.roleUser.findMany({
      where: {
        userId: user.id,
      },
      select: {
        roleId: true,
      },
    });

    const jwtPayload: JwtPayload = {
      uid: user.id,
      iid: value.code,
      knd: user.type,
      rol: roles.map((role) => role.roleId),
      jti: accessToken.id,
      exp: Math.round(expiresAt.getTime() / 1000),
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    // Everything is fine, so we can send the token to the user

    res
      .status(200)
      .setHeader(
        'Set-Cookie',
        `${this.config.auth.cookieKey}=${token}; Domain=${
          this.config.app.websiteHost
        }; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=${Math.round(
          expiresAt.getTime() / 1000,
        )}`,
      )
      .json({
        csrfToken,
        expiresAt: expiresAt.toISOString(),
      });
  }
}
