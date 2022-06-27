import { QuerySchema, querySchema } from './schema/query-schema.js';
import { HttpRequest, HttpResponse } from 'uWebSockets.js';
import { AuthService } from '../auth/auth.service.js';
import { UwsService } from '../uws/uws.service.js';
import { QueryService } from './query.service.js';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';
import qs from 'qs';

@Injectable()
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly authService: AuthService,
    private readonly uwsService: UwsService,
    private readonly uws: Uws,
  ) {
    uws.get('/query', this.query.bind(this));
    uws.options('/query', (res) => {
      uwsService.setCorsHeaders(res);
      res.end();
    });
  }

  private async query(res: HttpResponse, req: HttpRequest) {
    let aborted = false;

    res.onAborted(() => {
      aborted = true;
    });

    const cookie = req.getHeader('cookie');
    const csrfToken = req.getHeader('x-csrf-token');
    const rawQuery = req.getQuery();

    const session = await this.authService.authenticate(cookie, csrfToken);

    if (aborted) {
      return;
    }

    if (!session) {
      res.cork(() => {
        this.uwsService
          .setCorsHeaders(res)
          .writeHeader('Content-Type', 'application/json')
          .writeStatus('401')
          .end(
            JSON.stringify({
              code: 'UNAUTHORIZED',
              error: 'You are not authorized to make this request',
            }),
            true,
          );
      });

      return;
    }

    const parsedQuery = qs.parse(rawQuery);
    let query: QuerySchema;

    try {
      query = await querySchema.validateAsync(parsedQuery);
    } catch (e) {
      return res.cork(() => {
        this.uwsService
          .setCorsHeaders(res)
          .writeStatus('400')
          .writeHeader('Content-Type', 'application/json')
          .end(
            JSON.stringify({
              code: 'QUERY_INVALID',
              error: e.message,
            }),
          );
      });
    }

    if (!query.query) {
      query.query = {};
    }

    if (aborted) {
      return;
    }

    const result = await this.queryService.find(query, session);

    if (!aborted) {
      res.cork(() => {
        this.uwsService
          .setCorsHeaders(res)
          .writeHeader('Content-Type', 'application/json')
          .writeStatus('200')
          .end(JSON.stringify(result), true);
      });
    }
  }
}
