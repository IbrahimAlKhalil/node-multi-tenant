import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { OnEvent } from '@nestjs/event-emitter';

const events = new Set<string>();

export const OnWsSub = (
  event: string,
  options?: OnEventOptions,
): MethodDecorator => {
  if (events.has(event)) {
    throw new Error(
      `Duplicate handler for subscription "${event}" found. Please use a different event name.`,
    );
  }

  events.add(event);

  return OnEvent(`ws.req.${event}`, options);
};
