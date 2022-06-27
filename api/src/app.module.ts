import { InstituteModule } from './institute/institute.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from './helper/helper.module.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LibPnModule } from './lib-pn/lib-pn.module.js';
import { RedisModule } from './redis/redis.module.js';
import { QueryModule } from './query/query.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { UwsModule } from './uws/uws.module.js';
import { AppService } from './app.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LibPnModule,
    HelperModule,
    AuthModule,
    UwsModule,
    RedisModule,
    InstituteModule,
    QueryModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    UserModule,
  ],
  providers: [AppService],
})
export class AppModule {}
