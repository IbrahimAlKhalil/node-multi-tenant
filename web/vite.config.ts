import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
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
      include: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        './src/i18n/**',
      ),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
