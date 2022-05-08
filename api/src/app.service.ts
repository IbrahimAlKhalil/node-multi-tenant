import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthService } from './auth/auth.service.js';
import { BaseWsEvent } from './types/base-ws-event';
import { Injectable, Logger } from '@nestjs/common';
import { Config } from './config/config.js';
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
    private readonly config: Config,
    private readonly uws: Uws,
  ) {
    const { websocket } = config;

    import('uWebSockets.js').then(({ default: uwjs }) => {
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
  private schema = Joi.object<BaseWsEvent>({
    id: Joi.number().min(1),
    type: Joi.string().min(1).max(60).required(),
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

    if (session) {
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
    const { error, value } = this.schema.validate(msgObj);

    if (error) {
      this.logger.error(`Failed to validate message: ${msgTxt}`);
      return;
    }

    if (!value.id) {
      // Emit the event without listening for response
      this.eventEmitter.emit(value.type, {
        ws,
        data: value.data,
        binary: isBinary,
      });
      return;
    }

    // Emit the message
    let response: any[] = [];

    try {
      response = await this.eventEmitter.emitAsync(value.type, {
        ws,
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
