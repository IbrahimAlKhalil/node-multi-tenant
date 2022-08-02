import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
  locale: 'en',
});

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
