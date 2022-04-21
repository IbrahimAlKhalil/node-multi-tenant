import { Injectable } from '@nestjs/common';
import { Config } from './config/config.js';
import { Uws } from './uws/uws';

import {
  HttpRequest,
  HttpResponse,
  us_socket_context_t,
  WebSocket,
} from 'uWebSockets.js';

@Injectable()
export class AppService {
  constructor(private readonly config: Config, private readonly uws: Uws) {
    const { websocket } = config;

    import('uWebSockets.js').then(({ default: uwjs }) => {
      uws.ws('/*', {
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

    // Handle aborting by the user
    let aborted = false;
    res.onAborted(() => {
      aborted = true;
    });

    // Authenticate the client

    if (!aborted) {
      // Authenticated and not aborted, upgrade the connection

      res.upgrade({}, key, protocol, extensions, ctx);
    }
  }

  async message(ws: WebSocket, message: ArrayBuffer, isBinary: boolean) {
    // Convert ArrayBuffer to string
    const msg = Buffer.from(message).toString();

    // Log message
    console.log(`Received message: ${msg}`);
  }
}
