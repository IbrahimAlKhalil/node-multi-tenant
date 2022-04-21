import { initRenderer } from './middlewares/renderer';
import compression from 'compression';
import express from 'express';
import path from 'path';

(async function startServer() {
  const app = express();
  const router = express.Router();

  app.use(express.static(path.resolve(__dirname, '../public')));
  app.use(compression());

  app.use('/api', router);

  await initRenderer(app);
  app.listen(process.env.WEBSITE_PORT || 6001);
})();
