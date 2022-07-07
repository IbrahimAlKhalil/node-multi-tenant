import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client';
import { PageContext } from '#types/page-context';
import { getPage } from 'vite-plugin-ssr/client';
import { createApp } from './app';

(async function hydrate() {
  // We do Server Routing, but we can also do Client Routing by using `useClientRouter()`
  // instead of `getPage()`, see https://vite-plugin-ssr.com/useClientRouter
  const pageContext = await getPage<PageContextBuiltInClient & PageContext>();
  const { app, router } = createApp(pageContext);

  await router.isReady();

  app.mount('#app');
})();
