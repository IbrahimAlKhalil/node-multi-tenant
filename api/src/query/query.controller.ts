import { QuerySchema, querySchema } from './schema/query-schema.js';
import { InputInvalid } from '../exceptions/input-invalid.js';
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

    let query: QuerySchema;

    if (typeof req.query.query !== 'string') {
      throw new InputInvalid('You must provide a query');
    }

    try {
      query = await querySchema.validateAsync(JSON.parse(req.query.query));
    } catch (e) {
      throw new InputInvalid(e.message, e.details);
    }

    if (!query.query) {
      query.query = {};
    }

    const result = await this.queryService.find(query, session);

    return res.status(200).json(result);
  }
}
