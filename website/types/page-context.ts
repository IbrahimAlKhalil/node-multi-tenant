import { AbstractServiceOptions } from 'directus/dist/types/services';
import { ConcreteComponent } from 'vue';
import directus from 'directus';

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  Page: ConcreteComponent;
  pageProps?: Record<string, unknown>;
  schema: AbstractServiceOptions['schema'];
  directus: typeof directus;
  lang: 'en' | 'bn' | 'ar';
  urlPathname: string;
  documentProps?: {
    title?: string;
    description?: string;
  };
};
