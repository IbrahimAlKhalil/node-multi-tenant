import { AuthService } from './auth/auth.service.js';
import { Config } from './config/config.js';
import { Injectable } from '@nestjs/common';
import { Uws } from './uws/uws.js';

import {
  us_socket_context_t,
  HttpResponse,
  HttpRequest,
  WebSocket,
} from 'uWebSockets.js';

@Injectable()
export class AppService {
  constructor(
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

    const sessionVars = await this.authService.authenticate(cookie, csrfToken);

    // Request could be aborted while authenticating
    if (aborted) {
      return;
    }

    if (sessionVars) {
      // Authenticated and not aborted, upgrade the connection

      return res.upgrade(sessionVars, key, protocol, extensions, ctx);
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

  async message(ws: WebSocket, message: ArrayBuffer, isBinary: boolean) {
    // Convert ArrayBuffer to string
    const msg = Buffer.from(message).toString();

    // Log message
    console.log(`Received message: ${msg}`);
  }
}
