import { HttpRequest, HttpResponse } from 'uWebSockets.js';

export class UwsService {
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

  public setCorsHeaders(res: HttpResponse, req?: HttpRequest): HttpResponse {
    const _res = res
      .writeHeader('Access-Control-Allow-Origin', '*')
      .writeHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .writeHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Accept, Origin, X-Csrf-Token, Cookie',
      )
      .writeHeader('Access-Control-Max-Age', '3600');

    if (req) {
      return _res.end('', true);
    }

    return res;
  }
}
