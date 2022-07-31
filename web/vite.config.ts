import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
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
