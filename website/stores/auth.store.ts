import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', {
  state: () => ({
    user: {
      id: 1,
      name: 'John Doe',
      email: 'test@test.com',
      avatar: 'https://i.pravatar.cc/300?img=10',
    },
  }),
  actions: {},
});
