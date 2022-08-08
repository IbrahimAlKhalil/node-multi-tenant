import { createRouter, createWebHistory } from 'vue-router';
import App from '@/apps/qmmsoft.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: App,
      children: [],
    },
  ],
});

if (import.meta.env.DEV) {
  router.addRoute({
    path: '/dev-tools',
    component: () => import('@/apps/dev-tools.vue'),
  });
}

export default router;
