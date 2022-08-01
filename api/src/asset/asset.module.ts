import { AssetService } from './asset.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
