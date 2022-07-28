import { InternalServerError } from './exceptions/internal-server-error.js';
import { BaseException } from './exceptions/base-exception.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth/auth.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { WsMessage } from './types/ws-message';
import { Config } from './config/config.js';
import { WsSub } from './uws/ws-sub.js';
import { Uws } from './uws/uws.js';
import he from 'hyper-express';
import Joi from 'joi';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    const { websocket } = config;
    const path = '/ws/:csrfToken';

    uws.ws(
      path,
      {
        /* Configurations */

        // compression: he.compressors.SHARED_COMPRESSOR,
        max_payload_length: websocket.maxPayloadLength,
        idle_timeout: websocket.idleTimeout,
        max_backpressure: websocket.maxBackpressure,
        message_type: 'String',
      },
      (ws) => {
        ws.session = ws.context as any;

        ws.on('message', this.message.bind(this, ws));
      },
    );

    uws.upgrade(path, this.upgrade.bind(this));
  }

  private logger = new Logger(AppService.name);
  private schema = Joi.object<WsMessage>({
    id: Joi.number()
      .min(1)
      .when('type', {
        not: Joi.equal('evt'),
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
    type: Joi.string().allow('sub', 'req', 'evt').required(),
    name: Joi.string().min(1).max(60).required(),
    data: Joi.any(),
  });

  private async handleError(ws: he.Websocket, err: Error) {
    if (err instanceof InternalServerError || !(err instanceof BaseException)) {
      ws.send(
        JSON.stringify({
          status: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong, please try again later.',
        }),
      );

      this.logger.error(err);
    } else {
      ws.send(
        JSON.stringify({
          status: err.status,
          code: err.code,
          message: err.message,
          details: err.details,
        }),
      );
    }
  }

  private async upgrade(req: he.Request, res: he.Response) {
    // Keep the headers before the request object is gone
    const token = req.cookies.token;
    const csrfToken = req.params.csrfToken;

    // Authenticate the client

    const session = await this.authService.authenticate(token, csrfToken);

    if (session && session.knd !== 'PUBLIC') {
      // Authenticated and not aborted, upgrade the connection

      return res.upgrade(session);
    }

    // Not authorized and not aborted, close the connection
    res.status(401).json({
      status: 401,
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to connect to the websocket api',
    });
  }

  private async message(ws: he.Websocket, msg: string, isBinary: boolean) {
    // Convert ArrayBuffer to string
    const msgTxt = Buffer.from(msg).toString('utf-8');

    // Try to parse the message as JSON
    let msgObj: Record<string, any>;

    try {
      msgObj = JSON.parse(msgTxt);
    } catch (e) {
      ws.send(
        JSON.stringify({
          status: 400,
          code: 'MESSAGE_INVALID',
          message: e.message,
        }),
      );

      return;
    }

    // Validate the message
    let value: WsMessage;

    try {
      value = await this.schema.validateAsync(msgObj);
    } catch (e) {
      ws.send(
        JSON.stringify({
          status: 400,
          code: 'INPUT_INVALID',
          message: e.message,
          details: e.details,
        }),
      );
      return;
    }

    if (value.type === 'evt') {
      // Emit the event without listening for response
      this.eventEmitter
        .emitAsync(`ws.evt.${value.name}`, {
          ws,
          data: value.data,
          binary: isBinary,
        })
        .catch((e) => {
          this.handleError(ws, e);
        });

      return;
    }

    if (value.type === 'sub') {
      const wsSub = new WsSub(value.id, ws, isBinary, value.data);

      // Emit the event without listening for response
      this.eventEmitter.emitAsync(`ws.sub.${value.name}`, wsSub).catch((e) => {
        this.handleError(ws, e);
      });

      return;
    }

    // Emit the message
    let response: any[] = [];

    try {
      response = await this.eventEmitter.emitAsync(`ws.req.${value.name}`, {
        ws,
        id: value.id,
        data: value.data,
        binary: isBinary,
      });
    } catch (e) {
      return this.handleError(ws, e);
    }

    const data =
      response.length === 0
        ? null
        : response.length === 1
        ? response[0]
        : response;

    // Send the response
    ws.send(
      JSON.stringify({
        id: value.id,
        data: data ?? null,
        status: 200,
      }),
    );
  }
}
