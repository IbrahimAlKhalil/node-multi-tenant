import loginFormType from '#types/login-form-type';
import { defineStore } from 'pinia';
import { User } from '#types/user';

interface State {
  user: User | null;
}

export const useAuth = defineStore('auth', {
  state: (): State => ({
    user: null,
  }),
  actions: {
    async login(input: loginFormType): Promise<State['user']> {
      const res = await fetch(`/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const result = await res.json();

      (input.rememberMe ? localStorage : sessionStorage).setItem(
        'csrfToken',
        result.csrfToken,
      );

      localStorage.setItem('cluster', result.cluster);

      const success = res.status >= 200 && res.status <= 299;

      if (!success) {
        return null;
      }

      return this.getUserInfo();
    },
    async logout(): Promise<void> {
      localStorage.removeItem('csrfToken');
      sessionStorage.removeItem('csrfToken');

      this.user = null;
    },
    async getUserInfo(): Promise<State['user']> {
      if (!localStorage.getItem('cluster')) {
        console.warn('Cluster endpoint is not found in LocalStorage');
        return null;
      }

      if (this.user) {
        return this.user;
      }

      const res = await fetch(`${localStorage.getItem('cluster')}/user/me`, {
        headers: {
          'X-Csrf-Token':
            sessionStorage.getItem('csrfToken') ??
            localStorage.getItem('csrfToken') ??
            '',
        },
        credentials: 'include',
      });

      if (res.status > 299 || res.status < 200) {
        return null;
      }

      this.user = await res.json();

      return this.user;
    },
  },
});
