import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { OnEvent } from '@nestjs/event-emitter';

export const OnWsEvent = (
  event: string,
  options?: OnEventOptions,
): MethodDecorator => {
  return OnEvent(`ws.${event}`, options);
};
