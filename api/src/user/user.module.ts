import { PrismaModule } from '../prisma/prisma.module.js';
import { UserController } from './user.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { UwsModule } from '../uws/uws.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [UwsModule, AuthModule, PrismaModule],
  providers: [UserController],
})
export class UserModule {}
