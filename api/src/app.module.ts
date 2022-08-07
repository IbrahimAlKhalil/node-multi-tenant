import { VerificationModule } from './verification/verification.module.js';
import { InstituteModule } from './institute/institute.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HelperModule } from './helper/helper.module.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LibPnModule } from './lib-pn/lib-pn.module.js';
import { RedisModule } from './redis/redis.module.js';
import { QueryModule } from './query/query.module.js';
import { MinioModule } from './minio/minio.module.js';
import { AssetModule } from './asset/asset.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MailModule } from './mail/mail.module.js';
import { UwsModule } from './uws/uws.module.js';
import { SmsModule } from './sms/sms.module.js';
import { AppService } from './app.service.js';
import { Config } from './config/config.js';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
    }),
    BullModule.forRootAsync({
      useFactory({ redis }: Config) {
        return {
          redis: {
            host: redis.host,
            port: redis.port,
            password: redis.password ?? undefined,
          },
          defaultJobOptions: {
            removeOnComplete: true,
            attempts: 5,
          },
        };
      },
      inject: [Config],
    }),
    VerificationModule,
    InstituteModule,
    ConfigModule,
    PrismaModule,
    HelperModule,
    AssetModule,
    MinioModule,
    LibPnModule,
    RedisModule,
    QueryModule,
    AuthModule,
    UserModule,
    UwsModule,
    MailModule,
    SmsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
