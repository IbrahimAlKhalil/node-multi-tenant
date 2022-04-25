import { InstituteService } from './institute.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}
