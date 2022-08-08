import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isReady: false,
  }),

  actions: {
    init() {
      console.log('Initializing');
    },
  },
});
