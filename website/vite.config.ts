import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import ssr from 'vite-plugin-ssr/plugin';
import { svgLoader } from './svg-loader';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    svgLoader(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,
      include: __dirname + '/locales/**/*',
      compositionOnly: true,
    }),
    vue(),
    ssr(),
  ],
  resolve: {
    alias: {
      '#icons': __dirname + '/resources/icons',
      '#images': __dirname + '/resources/images',
      '#videos': __dirname + '/resources/videos',
      '#components': __dirname + '/components',
      '#modules': __dirname + '/modules',
      '#layouts': __dirname + '/layouts',
      '#stores': __dirname + '/stores',
      '#styles': __dirname + '/styles',
    },
  },
  optimizeDeps: {
    exclude: ['extensions'],
  },
});
