<template>
  <header
    class="fixed top-0 w-full z-[99999] transition duration-300 ease-in-out b"
    :class="{ 'bg-white dark:bg-dark shadow-md': isSticky }"
    style="height: var(--header-height)"
  >
    <div
      class="flex justify-between items-center container mx-auto py-3 h-full"
    >
      <div class="logo h-full z-[1]">
        <a href="/" class="block h-full">
          <img class="h-full" :alt="t('common.app-title')" :src="Logo" />
        </a>
      </div>

      <nav
        class="nav flex-grow lg:block"
        :class="{
          'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center bg-black/90 text-white':
            activeMenu,
          hidden: !activeMenu,
        }"
      >
        <ul class="flex flex-col md:flex-row items-center justify-center">
          <li
            class="m-0 py-2 md:p-0 group hover:text-primary text-2xl md:text-base"
            :class="{
              'dark:text-light dark:hover:text-secondary': isSticky,
              'text-primary': item.href === navData.currentPath && !isSticky,
              'dark:text-secondary text-primary':
                item.href === navData.currentPath && isSticky,
              'text-white md:text-text': item.href !== navData.currentPath,
            }"
            v-for="item in navData.data"
            :key="item.href"
          >
            <a
              :href="item.href"
              class="ml-2 p-2 rounded-sm font-bold text-md transition-all duration-150"
            >
              <component
                class="mr-1 text-inherit group-hover:scale-110 transition-scale duration-300 hidden xl:inline-block"
                :class="{ 'scale-125': item.href === navData.currentPath }"
                :is="item.icon"
              />

              {{ t(item.text) }}
            </a>
          </li>
        </ul>
      </nav>
      <div class="action-area z-[1]">
        <div
          class="lg:hidden rounded-md p-2 border flex justify-center items-center group transition duration-150"
          :class="{
            'border-primary hover:bg-primary': !activeMenu,
            'bg-secondary border-secondary hover:border-secondary': activeMenu,
          }"
          @click="activeMenu = !activeMenu"
        >
          <component
            class="transition duration-150 group-hover:text-white text-2xl md:text-4xl"
            :class="{ 'text-primary': !activeMenu, 'text-white': activeMenu }"
            style="bottom: 0"
            :is="!activeMenu ? MenuBar : Cross"
          />
        </div>
        <a href="/login">
          <primary-btn
            :title="t('common.login')"
            :icon="DoorOpen"
            class="hidden lg:block"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import { usePageContext } from '#modules/use-page-context';
import DoorOpen from '#icons/duotone/door-open.svg';
import { useNavData } from '#stores/navdata.store';
import { onMounted, onUnmounted, ref } from 'vue';
import MenuBar from '#icons/light/bars.svg';
import Cross from '#icons/light/times.svg';
import Logo from '#images/logo.svg?url';
import { useI18n } from 'vue-i18n';

const { urlPathname } = usePageContext();
const navData = useNavData();
const i18n = useI18n();

const activeMenu = ref(false);
const headerHeight = ref(70);
const isSticky = ref(false);
const t = ref(i18n.t);

if (navData.currentPath !== urlPathname) {
  navData.currentPath = urlPathname;
}

function checkStickyHeader() {
  return (
    (navData.currentPath.split('/')[1] === 'blog' &&
      navData.currentPath.split('/').length > 2) ||
    navData.currentPath.split('/')[1] === 'tutorials' ||
    navData.currentPath.split('/')[1] === 'admin'
  );
}

onMounted(() => {
  if (checkStickyHeader()) {
    isSticky.value = true;
  } else {
    window.addEventListener('scroll', () => updateScroll(window.scrollY));
    isSticky.value = window.scrollY !== 0;
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', () => updateScroll(window.scrollY));
});

const updateScroll = (value: number) => {
  if (value > headerHeight.value) {
    isSticky.value = true;
  }
  if (value < headerHeight.value) {
    isSticky.value = false;
  }
};
</script>
