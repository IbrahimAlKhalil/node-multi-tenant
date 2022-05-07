/* eslint-disable @typescript-eslint/no-empty-interface */

/**
 * Custom properties on the websocket object
 */

import { Session } from './session';

declare module 'uWebSockets.js' {
  export interface WebSocket extends Session {}
}
