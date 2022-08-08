import { RouterView } from 'vue-router';
import router from './router';
import '#styles/global.css';

const i18n = createI18n({
  legacy: false,
});

createApp(RouterView).use(createPinia()).use(router).use(i18n).mount('#app');
