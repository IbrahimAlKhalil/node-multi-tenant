import { LibPnService } from './lib-pn.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [LibPnService],
  exports: [LibPnService],
})
export class LibPnModule {}
