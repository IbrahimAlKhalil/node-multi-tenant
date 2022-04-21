import { HelperModule } from './helper/helper.module.js';
import { ConfigModule } from './config/config.module.js';
import { LibPnModule } from './lib-pn/lib-pn.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, LibPnModule, HelperModule],
  providers: [],
})
export class AppModule {}
