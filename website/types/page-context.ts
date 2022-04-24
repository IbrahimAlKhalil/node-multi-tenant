import { ConcreteComponent } from 'vue';

// The `pageContext` that are available in both on the server-side and browser-side
export type PageContext = {
  Page: ConcreteComponent;
  pageProps?: Record<string, unknown>;
  lang: 'en' | 'bn' | 'ar';
  urlPathname: string;
  documentProps?: {
    title?: string;
    description?: string;
  };
};
