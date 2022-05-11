<template>
  <div
    class="fixed top-20 right-0 z-[9999] p-2 rounded-l-md shadow-xl bg-light"
  >
    <div
      class="mood-switch w-8 h-8 rounded-full p-1 mb-3 border flex justify-center items-center cursor-pointer"
      :class="{
        'bg-dark text-secondary': !isDark,
        'bg-light text-secondary': isDark,
      }"
      @click="toggleDark"
    >
      <component :is="LightIcon" v-show="isDark" style="bottom: 0"></component>
      <component :is="DarkIcon" v-show="!isDark" style="bottom: 0"></component>
    </div>
    <div
      class="language-switch w-8 h-8 rounded-full p-1 border flex justify-center items-center cursor-pointer"
      @click="handleLanguageChange"
    >
      <component
        :is="LanguageChange"
        style="bottom: 0"
        class="text-2xl"
      ></component>
    </div>
  </div>
</template>

<script lang="ts">
import LanguageChange from '#icons/solid/language.svg';
import { defineComponent, ref, onMounted } from 'vue';
import LightIcon from '#icons/solid/sun.svg';
import DarkIcon from '#icons/solid/moon.svg';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'floating-switch',
  setup() {
    const i18n = useI18n({
      useScope: 'global',
    });

    const isDark = ref(false);

    const toggleDark = () => {
      isDark.value = !isDark.value;
      document.documentElement.classList.toggle('dark');
      localStorage.theme = isDark.value ? 'dark' : 'light';
    };

    const handleLanguageChange = () => {
      const lang = document.cookie.match(/lang=([^;]+)/);
      console.log(lang);
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
    });
    return {
      handleLanguageChange,
      LanguageChange,
      toggleDark,
      LightIcon,
      DarkIcon,
      isDark,
    };
  },
});
</script>
