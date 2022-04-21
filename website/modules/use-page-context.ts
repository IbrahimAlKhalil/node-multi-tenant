// Hook `usePageContext()` to make `pageContext` available from any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import type { App } from 'vue';
import { inject } from 'vue';
import { PageContext } from '#types/page-context';

export { usePageContext };
export { setPageContext };

const key = Symbol();

function usePageContext() {
  return inject(key) as PageContext;
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext);
}
