import { mutationSchema, MutationSchema } from './schema/mutation-schema.js';
import { QuerySchema, querySchema } from './schema/query-schema.js';
import { WsException } from '../exceptions/ws-exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OnWsReq } from '../decorators/on-ws-req.js';
import { OnWsSub } from '../decorators/on-ws-sub.js';
import { Injectable, Logger } from '@nestjs/common';
import { QueryService } from './query.service.js';
import { WsSub } from '../uws/ws-sub.js';
import { WsReq } from '../types/ws-req';

@Injectable()
export class QueryListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryService: QueryService,
  ) {}

  private logger = new Logger(QueryListener.name);

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

    if (!query.query) {
      query.query = {};
    }

    return this.queryService.find(query, ws.session);
  }

  @OnWsReq('mutation')
  async onMutation({ ws, data }: WsReq<MutationSchema>) {
    let mutation: MutationSchema;

    try {
      mutation = await mutationSchema.validateAsync(data);
    } catch (e) {
      this.logger.error(e);
      // Rethrow error with code and message
      throw new WsException(e.message, 'MUTATION_INVALID');
    }

    return this.queryService.mutate(mutation, ws.session);
  }

  @OnWsSub('mutation')
  async onMutationSub(wsSub: WsSub<MutationSchema>) {
    let mutation: MutationSchema;

    try {
      mutation = await mutationSchema.validateAsync(wsSub.data);
    } catch (e) {
      this.logger.error(e);
      // Rethrow error with code and message
      throw new WsException(e.message, 'MUTATION_INVALID');
    }

    return this.queryService.mutate(mutation, wsSub.ws.session, wsSub);
  }
}
