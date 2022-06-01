import { WebSocket } from 'uWebSockets.js';

export interface WsEvt<T = any> {
  ws: WebSocket;
  data: T;
  binary: boolean;
}
