import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth/auth.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { UwsService } from './uws/uws.service.js';
import { WsMessage } from './types/ws-message';
import { Config } from './config/config.js';
import { WsSub } from './uws/ws-sub.js';

import { Uws } from './uws/uws.js';
import {
  us_socket_context_t,
  HttpResponse,
  HttpRequest,
  WebSocket,
} from 'uWebSockets.js';
import Joi from 'joi';

@Injectable()
export class AppService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly authService: AuthService,
    private readonly uwsService: UwsService,
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    const { websocket } = config;

    import('uWebSockets.js').then(({ default: uwjs }) => {
      uws.options('/ws/:csrfToken', uwsService.setCorsHeaders.bind(uwsService));
      uws.ws('/ws/:csrfToken', {
        /* Configurations */

        compression: uwjs.SHARED_COMPRESSOR,
        maxPayloadLength: websocket.maxPayloadLength,
        idleTimeout: websocket.idleTimeout,
        maxBackpressure: websocket.maxBackpressure,

        /* Handlers */
        message: this.message.bind(this),
        upgrade: this.upgrade.bind(this),
      });
    });
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

  async upgrade(res: HttpResponse, req: HttpRequest, ctx: us_socket_context_t) {
    // Keep the headers before the request object is gone
    const key = req.getHeader('sec-websocket-key');
    const protocol = req.getHeader('sec-websocket-protocol');
    const extensions = req.getHeader('sec-websocket-extensions');
    const cookie = req.getHeader('cookie');
    const csrfToken = req.getParameter(0);

    // Handle aborting by the user
    let aborted = false;
    res.onAborted(() => {
      aborted = true;
    });

    // Authenticate the client

    const session = await this.authService.authenticate(cookie, csrfToken);

    // Request could be aborted while authenticating
    if (aborted) {
      return;
    }

    if (session && session.knd !== 'PUBLIC') {
      // Authenticated and not aborted, upgrade the connection

      return res.upgrade(session, key, protocol, extensions, ctx);
    }

    // Not authorized and not aborted, close the connection
    res.writeStatus('401');
    res.writeHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      }),
      true,
    );
  }

  async message(ws: WebSocket, msg: ArrayBuffer, isBinary: boolean) {
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
