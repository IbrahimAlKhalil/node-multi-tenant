import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { svgLoader } from './vite/svg-loader';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { DevTools } from './vite/dev-tools';
import { fileURLToPath, URL } from 'url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    DevTools,
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vue-i18n': ['createI18n', 'useI18n'],
        },
      ],
      dts: 'types/auto-imports.d.ts',
      vueTemplate: true,
      dirs: [
        './src/stores',
        './src/modules/**',
        './src/mixins/**',
        './src/components/**/modules/*',
        './src/components/**/mixins/*',
      ],
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true,
        globalsPropValue: true,
      },
    }),
    Components({
      extensions: ['vue', 'tsx', 'jsx'],
      dirs: './src/resources/icons',
      dts: false /*'types/icons.d.ts'*/,
      types: [],
      directive: false,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      extensions: ['vue', 'tsx', 'jsx'],
      dirs: ['./src/components'],
      dts: 'types/components.d.ts',
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView'],
        },
      ],
    }),
    vueI18n({
      compositionOnly: true,
      include: path.resolve(__dirname, './src/i18n/**'),
    }),
    vueJsx(),
    vue(),
    svgLoader(),
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
