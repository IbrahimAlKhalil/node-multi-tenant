import { UwsService } from './uws.service.js';
import { TemplatedApp } from 'uWebSockets.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import { Uws } from './uws.js';

@Module({
  providers: [
    {
      provide: Uws,
      useFactory(config: Config): Promise<TemplatedApp> {
        return new Promise(async (resolve) => {
          const { default: uws } = await import('uWebSockets.js');

          const app = uws.App();

          app.listen(config.app.port, () => resolve(app));
        });
      },
      inject: [Config],
    },
    UwsService,
  ],
  exports: [Uws, UwsService],
})
export class UwsModule {}
