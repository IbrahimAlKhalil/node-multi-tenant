import { LibPnModule } from '../lib-pn/lib-pn.module.js';
import { HelperService } from './helper.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [LibPnModule],
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
