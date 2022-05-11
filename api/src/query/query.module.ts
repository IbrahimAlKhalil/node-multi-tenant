import { PrismaModule } from '../prisma/prisma.module.js';
import { QueryListener } from './query.listener.js';
import { QueryService } from './query.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [QueryService, QueryListener],
  exports: [QueryService],
})
export class QueryModule {}
