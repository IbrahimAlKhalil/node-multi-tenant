import { InternalServerError } from '../exceptions/internal-server-error.js';
import { BaseException } from '../exceptions/base-exception.js';
import { Websocket } from 'hyper-express';
import { Logger } from '@nestjs/common';

export class WsSub<T = any> {
  constructor(
    public readonly id: number,
    public readonly ws: Websocket,
    public readonly isBinary: boolean,
    public readonly data?: T,
  ) {}

  private logger = new Logger(WsSub.name);

  public send(
    data: Record<string, any> | Record<string, any>[] | (string | number)[],
    finish?: boolean,
  ): void {
    this.ws.send(
      JSON.stringify({
        id: this.id,
        data,
        finish,
        status: 200,
      }),
    );
  }

  public finish(): void {
    this.ws.send(
      JSON.stringify({
        id: this.id,
        finish: true,
        status: 200,
      }),
    );
  }

  public error(err: Error, finish?: boolean): void {
    if (err instanceof InternalServerError || !(err instanceof BaseException)) {
      this.ws.send(
        JSON.stringify({
          id: this.id,
          finish,
          status: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong, please try again later.',
        }),
      );

      this.logger.error(err);
    } else {
      this.ws.send(
        JSON.stringify({
          id: this.id,
          finish,
          status: err.status,
          code: err.code,
          message: err.message,
          details: err.details,
        }),
      );
    }
  }
}
