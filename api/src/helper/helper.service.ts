import { LibPnService } from '../lib-pn/lib-pn.service.js';
import { Identity } from '../types/identity';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import joi from 'joi';

@Injectable()
export class HelperService {
  constructor(private readonly libPnService: LibPnService) {}

  public isEmail(value: string): boolean {
    const schema = joi.string().email();

    return !schema.validate(value).error;
  }

  public getIdentityType(value: string): Identity {
    if (this.isEmail(value)) {
      return {
        type: 'email',
        value: value,
      };
    }

    if (this.libPnService.validate(value)) {
      return {
        type: 'mobile',
        value: this.libPnService.format(value),
      };
    }

    return {
      type: 'username',
      value: value,
    };
  }

  public generateRandomString(length = 32): Promise<string> {
    return new Promise((resolve) => {
      crypto.randomBytes(length, (error, buffer) => {
        resolve(buffer.toString('hex'));
      });
    });
  }

  public generateRandomNumber(length = 3): Promise<number> {
    return new Promise((resolve) => {
      resolve(
        Math.floor(
          Math.pow(10, length - 1) +
            Math.random() *
              (Math.pow(10, length) - Math.pow(10, length - 1) - 1),
        ),
      );
    });
  }
}
