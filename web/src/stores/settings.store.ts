import { LOCAL_STORAGE_KEY, SETTINGS_STATE_GLOBAL_KEY } from '@/constants';
import type { UnwrapRef } from 'vue';
import { defineStore } from 'pinia';
import { i18n } from '@/init/i18n';
import { get } from 'lodash';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    lang: 'en' as 'en' | 'bn',
    theme: 'system' as 'system' | 'light' | 'dark',
  }),
  actions: {
    async init() {
      if (get(window, SETTINGS_STATE_GLOBAL_KEY)) {
        return;
      }

      const settingsStr = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (settingsStr) {
        this.$patch(JSON.parse(settingsStr));
      }

      this.loadTheme();
      await this.loadLocale();

      watch(() => this.$state.lang, this.loadLocale);
      watch(() => this.$state.theme, this.loadTheme);

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', this.loadTheme);

      this.$subscribe(
        () => {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.$state));
        },
        {
          detached: true,
          deep: true,
        },
      );

      Object.defineProperty(window, SETTINGS_STATE_GLOBAL_KEY, {
        value: true,
        enumerable: true,
        writable: false,
      });
    },

    loadTheme() {
      const settings = this.$state;
      document.documentElement.classList.remove('dark', 'light');

      let mode: UnwrapRef<typeof settings['theme']> = 'light';

      if (settings.theme !== 'system') {
        mode = settings.theme;
      }

      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        mode = 'dark';
      }

      document.documentElement.classList.add(mode);
    },

    async loadLocale() {
      const settings = this.$state;

      if (i18n.global.availableLocales.includes(settings.lang)) {
        return;
      }

      let messages: Record<string, any>;

      switch (settings.lang) {
        case 'bn':
          messages = await import('@/i18n/bn.json');
          break;
        default:
          messages = await import('@/i18n/en.json');
      }

      i18n.global.setLocaleMessage(settings.lang, messages.default);
      i18n.global.locale.value = settings.lang;
    },
  },
});
