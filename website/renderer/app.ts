import { setPageContext } from '#modules/use-page-context';
import { createSSRApp, defineComponent, h } from 'vue';
import { PageContext } from '#types/page-context';
import VueToast from 'vue-toast-notification';
import { createRouter } from '../vue-router';
import PageShell from './page-shell.vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import en from '../locales/en';
import bn from '../locales/bn';
import AOS from 'aos';
// CSS
import 'vue-toast-notification/dist/theme-sugar.css';
import 'aos/dist/aos.css';

export { createApp };

function createApp(pageContext: PageContext) {
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
            return h(pageContext.Page);
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
  app.use(VueToast, {
    position: 'bottom-right',
  });

  const router = createRouter();
  app.use(router);

  let first = true;
  router.beforeEach(() => {
    if (!import.meta.env.SSR) {
      if (first) {
        first = false;
        return;
      }

      pageContext.pageProps = undefined;
    }
  });

  pinia.use((ctx) => {
    if (typeof ctx.options.hydrate === 'function') {
      ctx.options.hydrate(ctx.store.$state, ctx.store.$state);
    }
  });

  // Make `pageContext` available from any Vue component
  setPageContext(app, pageContext);

  return { app, router };
}
