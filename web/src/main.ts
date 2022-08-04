import { vLoading } from 'element-plus/es/components/loading/src/directive';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/theme-chalk/base.css';

import 'element-plus/theme-chalk/el-loading.css';

const i18n = createI18n({
  legacy: false,
});

createApp(App)
  .directive('loading', vLoading)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app');
