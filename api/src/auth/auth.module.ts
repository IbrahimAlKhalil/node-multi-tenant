import { PrismaModule } from '../prisma/prisma.module.js';
import { HelperModule } from '../helper/helper.module.js';
import { AuthController } from './auth.controller.js';
import { UwsModule } from '../uws/uws.module.js';
import { AuthService } from './auth.service.js';
import { Config } from '../config/config.js';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: Config) => {
        const options = {
          subject: 'auth',
          audience: config.app.clusterHost,
        };

        return {
          secret: config.app.secret,
          signOptions: options,
          verifyOptions: options,
        };
      },
      inject: [Config],
    }),
    HelperModule,
    PrismaModule,
    UwsModule,
  ],
  exports: [JwtModule, AuthService],
  providers: [AuthService, AuthController],
})
export class AuthModule {}
