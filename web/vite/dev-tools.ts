import type { Plugin, ViteDevServer } from 'vite';

export const DevTools: Plugin = {
  name: 'qm-dev-tools',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/qm-dev-tools-api/i18n', (req, res, next) => {
      console.log('Hello');
      res
        .setHeader('Content-Type', 'application/json')
        .write(JSON.stringify({ name: 'Ibrahim' }));
      res.end();
    });
  },
};
