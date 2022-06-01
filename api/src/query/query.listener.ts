import { WsException } from '../exceptions/ws-exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OnWsReq } from '../decorators/on-ws-req.js';
import { Injectable, Logger } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { WsEvt } from '../types/ws-evt';

import {
  QuerySchema,
  querySchema,
  MutationType,
  QueryType,
} from './schema/query-schema.js';
import { WsReq } from '../types/ws-req';

@Injectable()
export class QueryListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryService: QueryService,
  ) {}

  private logger = new Logger(QueryListener.name);
  private queryTypes = new Set([
    'findMany',
    'findFirst',
    'findUnique',
    'count',
    'groupBy',
    'aggregate',
  ]);
  private mutationTypes = new Set([
    'create',
    'update',
    'delete',
    'upsert',
    'createMany',
    'updateMany',
    'deleteMany',
  ]);

  @OnWsReq('query')
  async onQuery({ ws, data }: WsReq<QuerySchema>) {
    let query: QuerySchema;

    try {
      query = await querySchema.validateAsync(data);
    } catch (e) {
      this.logger.error(e);
      // Rethrow error with code and message
      throw new WsException(e.message, 'QUERY_INVALID');
    }

    const session = {
      knd: ws.knd,
      iid: ws.iid,
      uid: ws.uid,
      jti: ws.jti,
      rol: ws.rol,
    };

    let result: any;

    if (this.queryTypes.has(query.type)) {
      result = await this.queryService.find(
        query as QuerySchema<QueryType>,
        session,
      );
    } else if (this.mutationTypes.has(query.type)) {
      result = await this.queryService.mutate(
        query as QuerySchema<MutationType>,
        session,
      );
    }

    return result;
  }
}
