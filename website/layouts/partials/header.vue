<template>
  <header
    class="fixed top-0 w-full z-[99999] transition duration-300 ease-in-out"
    :class="{ 'bg-white shadow-md': isSticky }"
    style="height: var(--header-height)"
  >
    <div
      class="flex justify-between items-center container mx-auto py-3 h-full"
    >
      <div class="logo h-full">
        <a href="/" class="block h-full">
          <img class="h-full" :alt="t('common.app-title')" :src="Logo" />
        </a>
      </div>

      <nav class="nav flex-grow hidden lg:block">
        <ul class="flex items-center justify-center">
          <li
            class="m-0 p-0 group text-text"
            v-for="item in navData.data"
            :key="item.href"
          >
            <a
              :href="item.href"
              class="ml-2 p-2 rounded-sm group-hover:text-primary font-bold text-md transition-all duration-150"
              :class="{ 'text-primary': item.href === navData.currentPath }"
            >
              <component
                class="mr-1 text-inherit group-hover:scale-110 transition-all duration-300 hidden xl:inline-block"
                :class="{ 'scale-125': item.href === navData.currentPath }"
                :is="item.icon"
              />

              {{ t(item.text) }}
            </a>
          </li>
        </ul>
      </nav>
      <div class="action-area">
        <div
          class="lg:hidden rounded-md p-2 border border-primary flex justify-center items-center group hover:bg-primary transition duration-150"
        >
          <component
            class="text-primary transition duration-150 group-hover:text-white text-4xl"
            style="bottom: 0"
            :is="MenuBar"
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
import Logo from '#images/logo.svg?url';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const { urlPathname } = usePageContext();
const navData = useNavData();

if (navData.currentPath !== urlPathname) {
  navData.currentPath = urlPathname;
}

onMounted(() => {
  window.addEventListener('scroll', (e: Event) => updateScroll(window.scrollY));
  window.addEventListener('hashchange', hashChange);

  if (location.hash) {
    hashChange();
  }
});
onUnmounted(() => {
  window.removeEventListener('scroll', (e: Event) =>
    updateScroll(window.scrollY),
  );
  window.removeEventListener('hashchange', hashChange);
});

const updateScroll = (value: number) => {
  if (value > headerHeight.value) {
    isSticky.value = true;
  }
  if (value < headerHeight.value) {
    isSticky.value = false;
  }
};

const hashChange = () => {
  navData.setCurrentPath(`/${location.hash}`);
};

const isSticky = ref(false);
const t = ref(i18n.t);
const headerHeight = ref(70);
</script>
