import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';
import type { PageContextBuiltIn } from 'vite-plugin-ssr';
import { renderToString } from '@vue/server-renderer';
import { PageContext } from '#types/page-context';
import { createApp } from './app';

export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'lang'];

async function render(
  pageContext: PageContextBuiltIn & PageContext,
): Promise<unknown> {
  const app = createApp(pageContext);
  const appHtml = await renderToString(app);

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext;
  const title = documentProps?.title ?? 'কওমী মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার';
  const desc =
    documentProps?.description ?? 'কওমী মাদ্রাসা ম্যানেজমেন্ট সফটওয়্যার';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang='en' class="dark">
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='description' content='${desc}' />
        <link rel='icon' type='image/png' sizes='512x512' href='/android-chrome-512x512.png'/>
        <link rel='icon' type='image/png' sizes='192x192' href='/android-chrome-192x192.png'/>
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png'/>
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png'/>
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png'/>
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png'/>
        <link rel='icon' href='/favicon.ico' />
        <link rel='manifest' href='/site.webmanifest' />
        <title>${title}</title>
      </head>
      <body>
        <main id='app'>${dangerouslySkipEscape(appHtml)}</main>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
