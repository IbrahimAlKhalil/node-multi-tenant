import { PermissionService } from './permission.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
