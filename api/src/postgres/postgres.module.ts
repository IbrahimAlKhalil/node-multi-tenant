import { POSTGRES } from './postgres.symbol.js';
import { Config } from '../config/config.js';
import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import postgres, { Sql } from 'postgres';

@Module({
  providers: [
    {
      provide: POSTGRES,
      useFactory(config: Config) {
        return postgres({
          host: config.postgres.host,
          port: config.postgres.port,
          database: config.postgres.database,
          username: config.postgres.user,
          password: config.postgres.password,
          publications: 'alltables',
        });
      },
      inject: [Config],
    },
  ],
  exports: [POSTGRES],
})
export class PostgresModule implements OnModuleDestroy {
  constructor(@Inject(POSTGRES) private readonly postgres: Sql<any>) {}

  async onModuleDestroy() {
    await this.postgres.end({ timeout: 10 });
  }
}
