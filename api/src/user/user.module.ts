import { PrismaModule } from '../prisma/prisma.module.js';
import { HelperModule } from '../helper/helper.module.js';
import { QueryModule } from '../query/query.module.js';
import { MinioModule } from '../minio/minio.module.js';
import { AssetModule } from '../asset/asset.module.js';
import { UserController } from './user.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { MailModule } from '../mail/mail.module.js';
import { UwsModule } from '../uws/uws.module.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UwsModule,
    AuthModule,
    PrismaModule,
    MinioModule,
    QueryModule,
    HelperModule,
    AssetModule,
    MailModule,
  ],
  providers: [UserController],
})
export class UserModule {}
