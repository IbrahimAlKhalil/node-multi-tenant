import { RouterView } from 'vue-router';
import { i18n } from '@/init/i18n';
import router from './router';
import '#styles/global.css';

createApp(RouterView).use(createPinia()).use(router).use(i18n).mount('#app');
