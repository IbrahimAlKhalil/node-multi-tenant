import { createRouter, createWebHistory } from 'vue-router';
import App from '@/entries/app.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: App,
      children: [],
    },
    {
      path: '/qm-dev-tool',
      component: () => import('@/entries/dev-tools.vue'),
    },
  ],
});

export default router;
