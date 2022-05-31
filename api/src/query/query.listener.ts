import { WsException } from '../exceptions/ws-exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { WsEvent } from '../types/ws-event.js';
import { OnWsEvent } from '../on-ws-event.js';

import {
  BaseQuery,
  baseQuery,
  MutationType,
  QueryType,
} from './schema/base-query.js';

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

  @OnWsEvent('query')
  async onQuery({ ws, data }: WsEvent<BaseQuery>) {
    let query: BaseQuery;

    try {
      query = await baseQuery.validateAsync(data);
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
        query as BaseQuery<QueryType>,
        session,
      );
    } else if (this.mutationTypes.has(query.type)) {
      result = await this.queryService.mutate(
        query as BaseQuery<MutationType>,
        session,
      );
    }

    return result;
  }
}
