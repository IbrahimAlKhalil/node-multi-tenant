import { WsException } from '../exceptions/ws-exception.js';
import { WebSocket } from 'uWebSockets.js';

export class WsSub<T = any> {
  constructor(
    public readonly id: number,
    public readonly ws: WebSocket,
    public readonly isBinary: boolean,
    public readonly data?: T,
  ) {}

  public send(
    data: Record<string, any> | Record<string, any>[] | (string | number)[],
    finish = false,
  ): void {
    this.ws.send(
      JSON.stringify({
        id: this.id,
        data,
        finish,
      }),
    );
  }

  public error(exception: WsException, finish = false): void {
    this.ws.send(
      JSON.stringify({
        id: this.id,
        error: {
          code: exception.code,
          message: exception.message,
          path: exception.path,
        },
        finish,
      }),
    );
  }
}