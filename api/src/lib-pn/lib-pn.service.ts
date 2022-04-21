import libPn from 'google-libphonenumber';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LibPnService {
  validate(mobile: string): boolean {
    const instance: libPn.PhoneNumberUtil = libPn.PhoneNumberUtil.getInstance();

    let phoneNumber: libPn.PhoneNumber;

    try {
      phoneNumber = instance.parseAndKeepRawInput(mobile);
      instance.isPossibleNumber(phoneNumber);
    } catch (e) {
      return false;
    }

    return true;
  }

  format(mobile: string): string {
    const instance: libPn.PhoneNumberUtil = libPn.PhoneNumberUtil.getInstance();

    const phoneNumber: libPn.PhoneNumber =
      instance.parseAndKeepRawInput(mobile);

    return instance.format(phoneNumber, libPn.PhoneNumberFormat.E164);
  }
}
