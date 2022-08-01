import { InstituteModule } from './institute/institute.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from './helper/helper.module.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LibPnModule } from './lib-pn/lib-pn.module.js';
import { RedisModule } from './redis/redis.module.js';
import { QueryModule } from './query/query.module.js';
import { MinioModule } from './minio/minio.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MailModule } from './mail/mail.module.js';
import { UwsModule } from './uws/uws.module.js';
import { AppService } from './app.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
    }),
    InstituteModule,
    ConfigModule,
    PrismaModule,
    HelperModule,
    MinioModule,
    LibPnModule,
    RedisModule,
    QueryModule,
    AuthModule,
    UserModule,
    UwsModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
