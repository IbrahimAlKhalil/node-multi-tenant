import { RedisService } from './redis.service.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: RedisService,
      useFactory(config: Config): Redis {
        return new Redis({
          host: config.redis.host,
          port: config.redis.port,
          password: config.redis.password ?? undefined,
        });
      },
      inject: [Config],
    },
  ],
})
export class RedisModule {}
