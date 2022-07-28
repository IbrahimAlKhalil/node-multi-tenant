import { InternalServerError } from '../exceptions/internal-server-error.js';
import HyperExpress, { MiddlewareHandler } from 'hyper-express';
import { BaseException } from '../exceptions/base-exception.js';
import { UserRouteHandler } from 'hyper-express';
import { Config } from '../config/config.js';
import { Logger, Module } from '@nestjs/common';
import { Uws } from './uws.js';
import helmet from 'helmet';
import cors from 'cors';

@Module({
  providers: [
    {
      provide: Uws,
      useFactory(config: Config): Promise<HyperExpress.Server> {
        return new Promise(async (resolve) => {
          const server = new HyperExpress.Server({
            auto_close: true,
            fast_abort: true,
            fast_buffers: true,
            max_body_length: 1e8,
            trust_proxy: true,
          });

          const allowedOrigins = new Set([
            new URL(`https://${config.app.websiteHost}`).origin,
            new URL(`https://${config.app.clusterHost}`).origin,
          ]);

          const corsMiddleware = cors({
            origin: Array.from(allowedOrigins),
            methods: ['GET', 'POST', 'UPDATE', 'DELETE', 'OPTIONS', 'HEAD'],
            allowedHeaders: [
              'Content-Type',
              'Authorization',
              'Accept',
              'Accept-Language',
              'Origin',
              'X-Csrf-Token',
              'Cookie',
              'X-Qm-Institute-Id',
            ],
            exposedHeaders: ['Content-Type'],
            credentials: true,
            maxAge: 3600,
          }) as UserRouteHandler;
          const helmetMiddleware = helmet() as unknown as MiddlewareHandler;

          server.use(helmetMiddleware);
          server.use(corsMiddleware);

          server.options('/*', corsMiddleware);

          const logger = new Logger(UwsModule.name);

          server.set_error_handler((req, res, err) => {
            if (
              err instanceof InternalServerError ||
              !(err instanceof BaseException)
            ) {
              res.status(500).json({
                status: 500,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong, please try again later.',
              });

              logger.error(err);
            } else {
              res.status(err.status).json({
                status: err.status,
                code: err.code,
                message: err.message,
                details: err.details,
              });
            }
          });

          server.uws_instance.listen(config.app.port, () => resolve(server));
        });
      },
      inject: [Config],
    },
  ],
  exports: [Uws],
})
export class UwsModule {}
