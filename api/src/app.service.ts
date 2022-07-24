import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth/auth.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { MiddlewareHandler } from 'hyper-express';
import { WsMessage } from './types/ws-message';
import { Config } from './config/config.js';
import { WsSub } from './uws/ws-sub.js';
import { Uws } from './uws/uws.js';
import he from 'hyper-express';
import helmet from 'helmet';
import cors from 'cors';
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

  async upgrade(req: he.Request, res: he.Response) {
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
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }

  async message(ws: he.Websocket, msg: string, isBinary: boolean) {
    // Convert ArrayBuffer to string
    const msgTxt = Buffer.from(msg).toString('utf-8');

    // Try to parse the message as JSON
    let msgObj: Record<string, any>;

    try {
      msgObj = JSON.parse(msgTxt);
    } catch (e) {
      this.logger.error(`Failed to parse message as JSON: ${msgTxt}`);
      return;
    }

    // Validate the message
    let value: WsMessage;

    try {
      value = await this.schema.validateAsync(msgObj);
    } catch (e) {
      this.logger.error(e.message);
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
          this.logger.error(e);
        });

      return;
    }

    if (value.type === 'sub') {
      const wsSub = new WsSub(value.id, ws, isBinary, value.data);

      // Emit the event without listening for response
      this.eventEmitter.emitAsync(`ws.sub.${value.name}`, wsSub).catch((e) => {
        this.logger.error(e);
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
      ws.send(
        JSON.stringify({
          id: value.id,
          error: {
            message: e.message,
            code: e.code ?? 'INTERNAL_ERROR',
          },
        }),
      );
      return;
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
      }),
    );
  }
}
