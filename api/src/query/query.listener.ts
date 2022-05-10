import { BaseQuery, baseQuery } from './schema/base-query.js';
import { WsException } from '../exceptions/ws-exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Injectable, Logger } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { OnEvent } from '@nestjs/event-emitter';
import { WsEvent } from '../types/ws-event';

@Injectable()
export class QueryListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryService: QueryService,
  ) {}

  private logger = new Logger(QueryListener.name);

  @OnEvent('query')
  async onQuery({ ws, data }: WsEvent<BaseQuery>) {
    let query: BaseQuery;

    try {
      query = await baseQuery.validateAsync(data);
    } catch (e) {
      this.logger.error(e);
      // Rethrow error with code and message
      throw new WsException(e.message, 'QUERY_INVALID');
    }

    const processedQuery = await this.queryService.processQuery(query, {
      knd: ws.knd,
      iid: ws.iid,
      uid: ws.uid,
      jti: ws.jti,
      rol: ws.rol,
    });

    const prisma = await this.prismaService.getPrisma(ws.iid);

    if (!prisma) {
      throw new WsException(
        `Instance #${ws.iid} is either not found or not active`,
        'UNAUTHORIZED',
      );
    }

    try {
      return (prisma[query.model][query.type] as any)(processedQuery.query);
    } catch (e) {
      throw new WsException(e.message, 'PRISMA_ERROR');
    }
  }
}
