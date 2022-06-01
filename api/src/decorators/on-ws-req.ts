import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { OnEvent } from '@nestjs/event-emitter';

export const OnWsReq = (
  event: string,
  options?: OnEventOptions,
): MethodDecorator => {
  return OnEvent(`ws.req.${event}`, options);
};
