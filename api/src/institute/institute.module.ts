import { InstituteService } from './institute.service.js';
import { MinioModule } from '../minio/minio.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [MinioModule],
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}
