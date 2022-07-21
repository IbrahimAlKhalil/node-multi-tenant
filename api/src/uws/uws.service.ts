import { HttpRequest, HttpResponse } from 'uWebSockets.js';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UwsService {
  constructor(private readonly config: Config) {}

  private readonly origin = new URL(`https://${this.config.app.clusterHost}`)
    .origin;

  private readonly allowedOrigins = new Set([
    new URL(`https://${this.config.app.websiteHost}`).origin,
    this.origin,
  ]);

  public readBodyAsJson(
    res: HttpResponse,
    req: HttpRequest,
  ): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      // Content-Type: application/json
      if (req.getHeader('content-type') !== 'application/json') {
        return reject(new Error('INVALID_CONTENT_TYPE'));
      }

      let buffer: Buffer;

      res.onData((ab, isLast) => {
        const chunk = Buffer.from(ab);

        if (isLast) {
          let json;

          if (buffer) {
            try {
              json = JSON.parse(
                Buffer.concat([buffer, chunk]).toString('utf-8'),
              );
            } catch (e) {
              return reject(new Error('INVALID_JSON'));
            }

            resolve(json);
          } else {
            try {
              json = JSON.parse(chunk.toString('utf-8'));
            } catch (e) {
              return reject(new Error('INVALID_JSON'));
            }

            resolve(json);
          }
        } else {
          if (buffer) {
            buffer = Buffer.concat([buffer, chunk]);
          } else {
            buffer = Buffer.concat([chunk]);
          }
        }
      });
    });
  }

  public handleJsonError(error: Error, res: HttpResponse): void {
    let code: string;
    let message: string;

    if (error.message === 'INVALID_CONTENT_TYPE') {
      code = 'INVALID_CONTENT_TYPE';
      message = 'Content-Type must be application/json';
    } else if (error.message === 'INVALID_JSON') {
      code = 'INVALID_JSON';
      message = 'Invalid JSON';
    } else {
      code = 'INTERNAL_ERROR';
      message = 'Internal error';
    }

    res
      .writeStatus('400')
      .writeHeader('Content-Type', 'application/json')
      .end(JSON.stringify({ code, message }), true);
  }

  public setCorsHeaders(
    res: HttpResponse,
    reqOrOrigin: HttpRequest | string,
    end = true,
  ): HttpResponse {
    const originFrom = !reqOrOrigin
      ? this.origin
      : typeof reqOrOrigin === 'string'
      ? reqOrOrigin
      : reqOrOrigin.getHeader('origin');

    const _res = res
      .writeHeader(
        'Access-Control-Allow-Origin',
        this.allowedOrigins.has(originFrom) ? originFrom : this.origin,
      )
      .writeHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, UPDATE, DELETE, OPTIONS',
      )
      .writeHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept, Accept-Language, Origin, X-Csrf-Token, Cookie, X-Qm-Institute-Id',
      )
      .writeHeader('Access-Control-Expose-Headers', 'Content-Type')
      .writeHeader('Access-Control-Allow-Credentials', 'true')
      .writeHeader('Access-Control-Max-Age', '3600');

    if (end) {
      return _res.end('', true);
    }

    return res;
  }
}
