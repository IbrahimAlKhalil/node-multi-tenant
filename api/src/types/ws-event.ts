import { WebSocket } from 'uWebSockets.js';

export interface WsEvent<T = any> {
  ws: WebSocket;
  data: T;
  binary: boolean;
}
