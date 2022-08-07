import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueI18n({
      compositionOnly: true,
      include: path.resolve(__dirname, './src/i18n/**'),
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      sourceMap: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      deep: true,
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#icons': path.resolve(__dirname, './src/resources/icons'),
      '#images': path.resolve(__dirname, './src/resources/images'),
      '#videos': path.resolve(__dirname, './src/resources/videos'),
      '#components': path.resolve(__dirname, './src/components'),
      '#pages': path.resolve(__dirname, './src/pages'),
      '#modules': path.resolve(__dirname, './src/modules'),
      '#layouts': path.resolve(__dirname, './src/layouts'),
      '#stores': path.resolve(__dirname, './src/stores'),
      '#styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    hmr: {
      port: 24679,
      clientPort: 24679,
      host: '127.0.0.1',
      protocol: 'ws',
    },
  },
});
