import { PrismaService } from '../prisma/prisma.service.js';
import { HelperService } from '../helper/helper.service.js';
import { HttpRequest, HttpResponse } from 'uWebSockets.js';
import { UwsService } from '../uws/uws.service.js';
import { JwtPayload } from '../types/jwt-payload';
import { LoginInput } from './types/login-input';
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
    private readonly jwtService: JwtService,
    private readonly uwsService: UwsService,
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    uws.post('/auth/login/:instituteId', this.login.bind(this));
  }

  private readonly loginSchema = joi.object<LoginInput>({
    username: joi.string().required(),
    password: joi.string().required(),
    rememberMe: joi.boolean().default(false),
  });

  private async login(res: HttpResponse, req: HttpRequest): Promise<void> {
    let aborted = false;

    res.onAborted(() => {
      aborted = true;
    });

    // Extract necessary data from request before calling any async functions
    const instituteId = req.getParameter(0);
    const ipAddress = Buffer.from(
      res.getProxiedRemoteAddressAsText(),
    ).toString();
    const userAgent = req.getHeader('user-agent');

    let body: Record<string, any>;

    try {
      // Parse request body
      body = await this.uwsService.readBodyAsJson(res, req);
    } catch (e) {
      if (!aborted) {
        this.uwsService.handleJsonError(e, res);
      }

      return;
    }

    // Request can be aborted while parsing body
    if (aborted) {
      return;
    }

    // Validate user input
    const { error, value } = await this.loginSchema.validate(body);

    // Request can be aborted while validating user input
    if (aborted) {
      return;
    }

    if (error) {
      // Validation failed

      res.writeStatus('400');
      res.writeHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 'INVALID_INPUT',
          message: error.message,
          details: error.details,
        }),
      );
      return;
    }

    const identity = this.helperService.getIdentityType(value.username);
    const prisma = await this.prismaService.getPrisma(instituteId);

    // Request can be aborted while getting prisma client
    if (aborted) {
      return;
    }

    if (!prisma) {
      // No prisma client found
      // Which means the instituteId is invalid

      res.writeStatus('404');
      res.writeHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 'INVALID_INPUT',
          message: 'Invalid institute id',
        }),
      );
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        [identity.type]: identity.value,
      },
    });

    // Request can be aborted while getting user
    if (aborted) {
      return;
    }

    if (
      !user ||
      user.disabled ||
      !user.password ||
      !(await argon2.verify(user.password, value.password))
    ) {
      // User not found or password is invalid or user is disabled

      if (aborted) {
        return;
      }

      res.writeStatus('401');
      res.writeHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          code: 'INVALID_CREDENTIALS',
          message: 'Username or password is incorrect',
        }),
      );
      return;
    }

    // Request can be aborted while verifying credentials
    if (aborted) {
      return;
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
      iid: instituteId,
      knd: user.type,
      rol: roles.map((role) => role.roleId),
      cst: csrfToken,
      jti: accessToken.id,
      exp: Math.round(expiresAt.getTime() / 1000),
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    // Request can be aborted while signing token
    if (aborted) {
      return;
    }

    // Everything is fine, so we can send the token to the user

    res.writeStatus('200');
    res.writeHeader('Content-Type', 'application/json');

    // Send the token as a cookie
    // The cookie should be accessible from all subdomains and top level domains
    // The cookie must have these properties:
    // - Secure: true
    // - HttpOnly: true
    // - Max-Age: the number of seconds until the cookie expires
    // - SameSite: Strict

    res.writeHeader(
      'Set-Cookie',
      `${this.config.auth.cookieKey}=${token}; Domain=${
        this.config.app.websiteHost
      }; HttpOnly; Secure; SameSite=Strict; Max-Age=${Math.round(
        expiresAt.getTime() / 1000,
      )}`,
    );

    res.end(
      JSON.stringify({
        csrfToken,
        expiresAt: expiresAt.toISOString(),
      }),
    );
  }
}
