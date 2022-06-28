import step1 from './registration/step-1';
import { initRenderer } from './renderer';
// import { initRenderer } from './middlewares/renderer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { startServer } from 'directus/server';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import emitter from 'directus/emitter';
import newsletter from './newsletter';
import { Express } from 'express';
import login from './login';

(async function () {
  emitter.onInit('middlewares.after', async ({ app }: { app: Express }) => {
    await initRenderer(app);

    app.post('/api/registration/step-1', step1);
    app.use('/api/login', login);
    app.post('/api/newsletter', newsletter);
  });
  await startServer();
})();
