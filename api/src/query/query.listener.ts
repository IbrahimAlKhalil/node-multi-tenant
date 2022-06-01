import { mutationSchema, MutationSchema } from './schema/mutation-schema.js';
import { QuerySchema, querySchema } from './schema/query-schema.js';
import { WsException } from '../exceptions/ws-exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OnWsReq } from '../decorators/on-ws-req.js';
import { Injectable, Logger } from '@nestjs/common';
import { QueryService } from './query.service.js';
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

    return this.queryService.find(query, {
      knd: ws.knd,
      iid: ws.iid,
      uid: ws.uid,
      jti: ws.jti,
      rol: ws.rol,
    });
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

    return this.queryService.mutate(mutation, {
      knd: ws.knd,
      iid: ws.iid,
      uid: ws.uid,
      jti: ws.jti,
      rol: ws.rol,
    });
  }
}
