import Index from './index.vue';
import router from './router';

import '#styles/global.css';

const i18n = createI18n({
  legacy: false,
});

createApp(Index).use(createPinia()).use(router).use(i18n).mount('#app');
