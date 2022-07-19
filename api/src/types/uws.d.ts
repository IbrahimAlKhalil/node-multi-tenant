/* eslint-disable @typescript-eslint/no-empty-interface */

import { user_kind } from '../../prisma/client';
import { Session } from './session';

/**
 * Custom properties on the websocket object
 */

declare module 'uWebSockets.js' {
  export interface WebSocket extends Session<user_kind> {}
}
