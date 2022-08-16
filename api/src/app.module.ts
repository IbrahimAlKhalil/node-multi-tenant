import { VerificationModule } from './verification/verification.module.js';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from './config/config.module.js';
import { QueryModule } from './query/query.module.js';
import { MinioModule } from './minio/minio.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { MailModule } from './mail/mail.module.js';
import { UwsModule } from './uws/uws.module.js';
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
    ConfigModule,
    MinioModule,
    QueryModule,
    AuthModule,
    UserModule,
    UwsModule,
    MailModule,
  ],
  providers: [AppService],
})
export class AppModule {}
