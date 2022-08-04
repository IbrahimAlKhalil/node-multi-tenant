import { Injectable } from '@nestjs/common';
import { SmsDataType } from './types/sms-data-type.js';

@Injectable()
export class SmsService {
  //   constructor() {}
  public async send(data: SmsDataType) {
    console.log('SMS service: ', data);
  }
}
