import { PrismaModule } from '../prisma/prisma.module.js';
import { QueryController } from './query.controller.js';
import { QueryListener } from './query.listener.js';
import { AuthModule } from '../auth/auth.module.js';
import { QueryService } from './query.service.js';
import { UwsModule } from '../uws/uws.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, UwsModule, AuthModule],
  providers: [QueryService, QueryListener, QueryController],
  exports: [QueryService],
})
export class QueryModule {}
