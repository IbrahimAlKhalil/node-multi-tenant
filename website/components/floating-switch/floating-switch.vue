<template>
  <div
    class="fixed top-20 right-0 z-[9999] rounded-l-md shadow-xl bg-light active:cursor-move"
  >
    <div class="relative px-2 py-3 min-h-[5rem] flex flex-col justify-between">
      <div
        class="absolute top-1/2 left-0 -translate-y-1/2 text-gray-400 text-2xl hover:text-text cursor-pointer"
        @click="toggleMinimize"
      >
        <AngleLeft v-show="isMinimized" style="bottom: 0" />
        <AngleRight v-show="!isMinimized" style="bottom: 0" />
      </div>
      <div
        class="mood-switch w-8 h-8 rounded-full p-1 mb-3 border flex justify-center items-center cursor-pointer"
        :class="{
          'bg-dark text-secondary': !isDark,
          'bg-light text-secondary': isDark,
        }"
        v-show="!isMinimized"
        @click="toggleDark"
      >
        <LightIcon v-show="isDark" style="bottom: 0" />
        <DarkIcon v-show="!isDark" style="bottom: 0" />
      </div>
      <div
        class="language-switch w-8 h-8 rounded-full p-1 border flex justify-center items-center cursor-pointer"
        v-show="!isMinimized"
        @click="handleLanguageChange"
      >
        <LanguageChange style="bottom: 0" class="text-2xl" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AngleRight from '#icons/regular/angle-right.svg';
import AngleLeft from '#icons/regular/angle-left.svg';
import LanguageChange from '#icons/solid/language.svg';
import { defineComponent, ref, onMounted } from 'vue';
import LightIcon from '#icons/solid/sun.svg';
import DarkIcon from '#icons/solid/moon.svg';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'floating-switch',
  components: { AngleRight, AngleLeft, LanguageChange, LightIcon, DarkIcon },
  setup() {
    const i18n = useI18n({
      useScope: 'global',
    });

    const isDark = ref(false);
    const isMinimized = ref(false);

    const toggleDark = () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark.value ? 'dark' : 'light';
    };
    const toggleMinimize = () => {
      isMinimized.value = !isMinimized.value;
      localStorage.setItem('minimized', isMinimized.value ? '1' : '0');
    };

    const handleLanguageChange = () => {
      const lang = document.cookie.match(/lang=([^;]+)/);
      if (lang) {
        document.cookie = `lang=${lang[1] === 'en' ? 'bn' : 'en'}`;
        i18n.locale.value = `${lang[1] === 'en' ? 'bn' : 'en'}`;
      } else {
        document.cookie = `lang=en`;
        i18n.locale.value = 'en';
      }
    };

    onMounted(() => {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      isDark.value = localStorage.theme === 'dark';
      const minimized = localStorage.getItem('minimized');
      if (minimized) {
        isMinimized.value = minimized === '1' ? true : false;
      }
    });
    return {
      handleLanguageChange,
      toggleMinimize,
      isMinimized,
      toggleDark,
      isDark,
    };
  },
});
</script>
