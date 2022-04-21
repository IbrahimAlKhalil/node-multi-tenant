import { defineStore } from 'pinia';

export const useStyleStore = defineStore('style', {
  state: () => ({
    breakpoints: {
      'sm-and-down': false,
      'md-and-down': false,
      'md-and-up': false,
      'lg-and-up': false,
    },
  }),
  hydrate(state) {
    if (import.meta.env.SSR) {
      return;
    }

    const sizes = {
      sm: 768,
      md: 992,
      lg: 1200,
      xl: 1920,
    };

    const queries: {
      [B in keyof typeof state.breakpoints]: string;
    } = {
      'sm-and-down': `(max-width: ${sizes.md - 1}px)`,
      'md-and-down': `(max-width: ${sizes.lg - 1}px)`,
      'md-and-up': `(min-width: ${sizes.md - 1}px)`,
      'lg-and-up': `(min-width: ${sizes.lg - 1}px)`,
    };

    const breakpointNames = Object.keys(
      queries,
    ) as (keyof typeof state.breakpoints)[];

    for (const breakpointName of breakpointNames) {
      const mediaQueryList = window.matchMedia(queries[breakpointName]);

      state.breakpoints[breakpointName] = mediaQueryList.matches;

      mediaQueryList.addEventListener('change', (mql) => {
        state.breakpoints[breakpointName] = mql.matches;
      });
    }
  },
});
