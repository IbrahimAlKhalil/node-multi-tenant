import { PermissionService } from './permission.service.js';
import { Module } from '@nestjs/common';

@Module({
  providers: [PermissionService],
})
export class PermissionModule {}
