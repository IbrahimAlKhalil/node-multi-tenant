import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { OnEvent } from '@nestjs/event-emitter';

export const OnWsEvt = (
  event: string,
  options?: OnEventOptions,
): MethodDecorator => {
  return OnEvent(`ws.evt.${event}`, options);
};
