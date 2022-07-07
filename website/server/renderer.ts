import { createPageRenderer } from 'vite-plugin-ssr';
import express, { Express } from 'express';
import pageRoutes from './page-routes';
import * as directus from 'directus';

export async function initRenderer(app: Express) {
  const isProduction = process.env.NODE_ENV === 'production';
  const root = `${__dirname}/../`;

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const vite = await import('vite');
    viteDevServer = await vite.createServer({
      root,
      server: {
        middlewareMode: 'ssr',
        hmr: {
          clientPort: 24678,
          host: '127.0.0.1',
          protocol: 'ws',
        },
      },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });

  app.get(pageRoutes, async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      schema: (req as unknown as { schema: directus.ItemsService['schema'] })
        .schema,
      directus,
      lang: req.query.lang ?? req.cookies.lang ?? 'bn',
      url,
    };

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });
}
