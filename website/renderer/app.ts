import { setPageContext } from '#modules/use-page-context';
import { createSSRApp, defineComponent, h } from 'vue';
import { PageContext } from '#types/page-context';
import PageShell from './page-shell.vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import en from '../locales/en';
import bn from '../locales/bn';
import AOS from 'aos';
import 'aos/dist/aos.css';

export { createApp };

function createApp(pageContext: PageContext) {
  const { Page, pageProps } = pageContext;
  const PageWithLayout = defineComponent({
    mounted() {
      AOS.init();
    },
    render() {
      return h(
        PageShell,
        {},
        {
          default() {
            return h(Page, pageProps || {});
          },
        },
      );
    },
  });

  const i18n = createI18n({
    locale: pageContext.lang,
    legacy: false,
    messages: { en, bn },
  });
  const pinia = createPinia();

  const app = createSSRApp(PageWithLayout);

  app.use(i18n);
  app.use(pinia);

  pinia.use((ctx) => {
    if (typeof ctx.options.hydrate === 'function') {
      ctx.options.hydrate(ctx.store.$state, ctx.store.$state);
    }
  });

  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext);

  return app;
}
