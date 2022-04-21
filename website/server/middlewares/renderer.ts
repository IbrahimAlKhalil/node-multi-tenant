import { createPageRenderer } from 'vite-plugin-ssr';
import express, { Express } from 'express';

export async function initRenderer(app: Express) {
  const isProduction = process.env.NODE_ENV === 'production';
  const root = `${__dirname}/../..`;

  let viteDevServer;
  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const vite = await import('vite');
    viteDevServer = await vite.createServer({
      root,
      server: { middlewareMode: 'ssr' },
    });
    app.use(viteDevServer.middlewares);
  }

  const renderPage = createPageRenderer({ viteDevServer, isProduction, root });

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    const pageContextInit = {
      lang: req.query.lang ?? 'bn',
      url,
    };

    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) return next();
    const { body, statusCode, contentType } = httpResponse;
    res.status(statusCode).type(contentType).send(body);
  });
}
