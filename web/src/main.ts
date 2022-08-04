import { vLoading } from 'element-plus/es/components/loading/src/directive';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import router from './router';
import App from './App.vue';

import 'element-plus/theme-chalk/dark/css-vars.css';
import 'element-plus/theme-chalk/base.css';

import 'element-plus/theme-chalk/el-loading.css';

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
});

app.directive('loading', vLoading);
app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
