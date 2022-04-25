import { InstituteModule } from './institute/institute.module.js';
import { HelperModule } from './helper/helper.module.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LibPnModule } from './lib-pn/lib-pn.module.js';
import { RedisModule } from './redis/redis.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    LibPnModule,
    HelperModule,
    RedisModule,
    InstituteModule,
  ],
})
export class AppModule {}
