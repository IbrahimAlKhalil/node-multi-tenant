import { QueryListener } from './query.listener.js';
import { QueryService } from './query.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [QueryService, QueryListener],
  exports: [QueryService],
})
export class QueryModule {}
