import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  //   constructor() {}

  private logger = new Logger(SmsService.name);

  public async send(message: string, ...contact: string[]) {
    this.logger.log({ message, contact });
  }
}
