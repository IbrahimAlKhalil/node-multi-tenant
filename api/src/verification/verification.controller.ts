import { verificationSchema } from './schema/verification.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { HelperService } from '../helper/helper.service.js';
import { QueryService } from '../query/query.service.js';
import { MailService } from '../mail/mail.service.js';
import { AuthService } from '../auth/auth.service.js';
import { SmsService } from '../sms/sms.service.js';
import { Request, Response } from 'hyper-express';
import { verifySchema } from './schema/verify.js';
import { Session } from '../types/session.js';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { UserKind } from 'prisma/client';
import { Uws } from '../uws/uws.js';

@Injectable()
export class VerificationController {
  constructor(
    private readonly helperService: HelperService,
    private readonly prismaService: PrismaService,
    private readonly queryService: QueryService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
    private readonly smsService: SmsService,
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    uws.post('/verification/request', this.request.bind(this));
    uws.post('/verification/verify', this.verify.bind(this));
  }

  private async request(req: Request, res: Response) {
    const { error, value } = verificationSchema.validate(await req.json(), {
      convert: true,
    });

    if (error || !value) {
      // Validation failed
      throw new InputInvalid(error.message, error.details);
    }

    const session = await this.authService.authenticateReq(
      req,
      res,
      value.type === 'PASSWORD_RESET',
    );

    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);
    const identity = this.helperService.getIdentityType(
      value.type === 'PASSWORD_RESET' ? value.emailOrMobile : value.target,
    );

    if (value.type === 'PASSWORD_RESET' && identity.type === 'username') {
      throw new InputInvalid(
        'Username is not allowed, you have to provide either email or mobile number',
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        [value.type === 'PASSWORD_RESET' ? identity.type : 'id']:
          value.type === 'PASSWORD_RESET'
            ? identity.value
            : (session as Session<UserKind>).uid,
      },
    });

    if (!user || user.disabled) {
      throw new InputInvalid('Username or institute id invalid!');
    }

    const token = await this.helperService.generateRandomNumber(6);

    const key = await this.helperService.generateRandomString(
      this.config.auth.csrfTokenLength,
    );

    const verification = await prisma.verification.create({
      data: {
        userId: user.id,
        key,
        token,
        type: value.type,
        expireAt: new Date(Date.now() + this.config.verification.expireAt),
        target:
          value.type === 'PASSWORD_RESET' ? value.emailOrMobile : value.target,
      },
    });

    if (identity.type === 'mobile') {
      await this.smsService.send(
        `Your verification code is ${token}. Do not share with others.`,
        identity.value,
      );
    } else if (identity.type === 'email') {
      let subject = 'Email Verification - QmmSoft';
      let template = 'templates/email-verification.mjml';

      if (value.type === 'PASSWORD_RESET') {
        subject = 'Password Reset - QmmSoft';
        template = 'templates/reset-password.mjml';
      }

      const job = await this.mailService.queue.add(
        {
          from: this.config.mail.passwordResetFrom,
          to: identity.value,
          subject,
          template,
          variables: {
            code: token,
            url: `${this.config.app.websiteOrigin}/verification?&id=${verification.id}&key=${key}&token=${token}&userId=${user.id}`,
          },
        },
        {
          jobId: verification.id,
        },
      );

      job.finished().then(async () => {
        await prisma.verification.update({
          where: {
            id: verification.id,
          },
          data: {
            sentAt: new Date(),
            sentCount: verification.sentCount + 1,
          },
        });
      });
    }

    res
      .status(200)
      .json({ key, id: verification.id, userId: user.id, success: true });
  }

  private async verify(req: Request, res: Response) {
    const { error, value } = verifySchema.validate(await req.json(), {
      convert: true,
    });

    if (error || !value) {
      // Validation failed
      throw new InputInvalid(error.message, error.details);
    }

    const session = await this.authService.authenticateReq(
      req,
      res,
      value.type === 'PASSWORD_RESET',
    );

    const prisma = await this.prismaService.getPrismaOrThrow(session.iid);

    const verification = await prisma.verification.findUnique({
      where: {
        id: value.id,
      },
    });

    if (!verification || verification.expireAt.getTime() < Date.now()) {
      throw new InputInvalid('Wrong id or expired!');
    }

    if (!value?.token && !value?.key) {
      throw new InputInvalid('Token or key must in request body!');
    }

    if (value?.token && verification.token === value.token) {
      res.status(200).json({ token: value.token });
    }

    if (value?.key && verification.key === value.key)
      res.status(200).json({ key: value.key });
  }
}
