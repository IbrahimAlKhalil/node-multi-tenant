import { changePasswordSchema } from './types/change-password.js';
import { passwordResetSchema } from './types/password-reset.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HelperService } from '../helper/helper.service.js';
import { QueryService } from '../query/query.service.js';
import { MailService } from '../mail/mail.service.js';
import { AuthService } from '../auth/auth.service.js';
import { NotFound } from '../exceptions/not-found.js';
import { SmsService } from '../sms/sms.service.js';
import { Request, Response } from 'hyper-express';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';
import argon2 from 'argon2';

@Injectable()
export class VarificationController {
  constructor(
    private readonly uws: Uws,
    private readonly helperService: HelperService,
    private readonly prismaService: PrismaService,
    private readonly config: Config,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly queryService: QueryService,
  ) {
    uws.get('/verification/request', this.verification.bind(this));
  }

  private async verification(req: Request, res: Response) {
    const { error, value } = passwordResetSchema.validate(await req.json(), {
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

    if (!user || user.disabled) {
      throw new InputInvalid('Username or institute id invalid!');
    }

    const token = await this.helperService.generateRandomNumber(6);

    const key = await this.helperService.generateRandomString(
      this.config.auth.csrfTokenLength,
    );

    try {
      const passwordReset = await prisma.verification.create({
        data: {
          userId: user.id,
          type: value.type,
          key,
          token,
        },
      });

      if (value.type === 'sms') {
        await this.smsService.send({
          payload: 'Message controller setup success.',
        });
      }

      if (value.type === 'email') {
        await this.mailService.queue.add({
          from: this.config.mail.passwordResetFrom,
          to: user?.email ?? '',
          subject: 'Password reset - QmmSoft',
          template: 'templates/reset-password.mjml',
          variables: {
            code: token,
          },
        });
      }

      res.status(200).json({ key, id: passwordReset.id, success: true });
    } catch (error) {
      // TODO Error handling
      res.status(500).json({ error: true });
    }
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
}
