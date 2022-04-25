import { InstituteModule } from '../institute/institute.module.js';
import { PrismaService } from './prisma.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [InstituteModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
