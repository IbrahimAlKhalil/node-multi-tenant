import { initRenderer } from './renderer';
// import { initRenderer } from './middlewares/renderer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { startServer } from 'directus/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emitter from 'directus/emitter';
import authCheck from './auth-check';
import { Express } from 'express';
import reaction from './reaction';
import login from './login';
import comment from './comment';

(async function () {
  emitter.onInit('middlewares.after', async ({ app }: { app: Express }) => {
    await initRenderer(app);

    app.use('/api/login', login);
    app.use('/api/reaction', authCheck, reaction);
    app.use('/api/comment', authCheck, comment);
  });
  await startServer();
})();
