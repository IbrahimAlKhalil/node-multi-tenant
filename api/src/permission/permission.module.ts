import { PermissionService } from './permission.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
