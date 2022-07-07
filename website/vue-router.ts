import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router';

export { createRouter };

function createRouter() {
  return _createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes: [
      {
        path: '/',
        component: () => import('./pages/index/index.page.vue'),
      },
      {
        path: '/contact',
        component: () => import('./pages/contact/index.page.vue'),
      },
      {
        path: '/login',
        component: () => import('./pages/login/index.page.vue'),
      },
      {
        path: '/signup',
        component: () => import('./pages/signup/index.page.vue'),
      },
      {
        path: '/password-reset',
        component: () => import('./pages/password-reset/index.page.vue'),
      },
      {
        path: '/faq',
        component: () => import('./pages/faq/index.page.vue'),
      },
      {
        path: '/tutorials',
        component: () => import('./pages/tutorials/index.page.vue'),
        children: [
          {
            path: ':slug',
            component: () => import('./pages/tutorials/tutorial.page.vue'),
          },
        ],
      },
      {
        path: '/blog',
        component: () => import('./pages/blog/index.page.vue'),
        children: [
          {
            path: ':slug',
            component: () => import('./pages/blog/post.page.vue'),
          },
        ],
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('./renderer/_error.page.vue'),
      },
    ],
  });
}
