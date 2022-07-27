import { QuerySchema, querySchema } from './schema/query-schema.js';
import { AuthService } from '../auth/auth.service.js';
import { QueryService } from './query.service.js';
import { Request, Response } from 'hyper-express';
import { Injectable } from '@nestjs/common';
import { Uws } from '../uws/uws.js';

@Injectable()
export class QueryController {
  constructor(
    private readonly queryService: QueryService,
    private readonly authService: AuthService,
    private readonly uws: Uws,
  ) {
    uws.get('/query', this.query.bind(this));
  }

  private async query(req: Request, res: Response) {
    const session = await this.authService.authenticateReq(req, res, true);

    if (!session) return;

    let query: QuerySchema;

    if (typeof req.query.query !== 'string') {
      return res.status(400).json({
        code: 'QUERY_INVALID',
        message: 'You must provide a query',
      });
    }

    try {
      query = await querySchema.validateAsync(JSON.parse(req.query.query));
    } catch (e) {
      return res.status(400).json({
        code: 'QUERY_INVALID',
        message: e.message,
      });
    }

    if (!query.query) {
      query.query = {};
    }

    try {
      const result = await this.queryService.find(query, session);

      return res.status(200).json(result);
    } catch (e) {
      console.error(e);

      res.status(500).json({
        message: 'Something went wrong, please try again later.',
        code: 'INTERNAL_ERROR',
      });
    }
  }
}
