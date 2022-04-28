<template>
  <header
    class="fixed top-0 w-full z-10 transition duration-300 ease-in-out "
    :class="{ 'bg-white shadow-md': isSticky }"
    style="height: var(--header-height)"
  >
    <div
      class="flex justify-between items-center container mx-auto py-3 h-full"
    >
      <div class="logo h-full">
        <a href="/" class="block h-full">
          <img
            :alt="t('common.app-title')"
            class="h-full md:hidden"
            :src="LogoIcon"
          />

          <img
            class="h-full hidden md:block"
            :alt="t('common.app-title')"
            :src="Logo"
          />
        </a>
      </div>

      <nav class="nav flex-grow hidden lg:block">
        <ul class="flex items-center justify-center">
          <li class="m-0 p-0 group" v-for="item in menu" :key="item.href">
            <a
              :href="item.href"
              class="ml-2 p-2 rounded-sm group-hover:text-primary font-bold text-md text-text transition-all duration-150"
              :class="{ 'text-primary': item.href === currentPath }"
            >
              <component
                class="mr-1 text-inherit group-hover:scale-110 transition-all duration-300 hidden xl:inline-block"
                :class="{ 'scale-150': item.href === currentPath }"
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
        <primary-btn
          :title="t('common.login')"
          :icon="DoorOpen"
          class="hidden lg:block"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import IconQuestionCircle from '#icons/duotone/question-circle.svg';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import IconPhoneLaptop from '#icons/duotone/phone-laptop.svg';
import IconInfoCircle from '#icons/duotone/info-circle.svg';
import IconMoneyCheck from '#icons/duotone/money-check.svg';
import { usePageContext } from '#modules/use-page-context';
import LoginWhite from '#icons/others/login-white.svg?url';
import IconBookOpen from '#icons/duotone/book-open.svg';
import DoorOpen from '#icons/duotone/door-open.svg';
import MenuBar from '#icons/light/bars.svg';
import IconBlog from '#icons/duotone/blog.svg';
import LogoIcon from '#images/icon.svg?url';
import Logo from '#images/logo.svg?url';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

onMounted(() => {
  window.addEventListener('scroll', (e) => updateScroll(window.scrollY));
});

const updateScroll = (value) => {
  if (value > headerHeight.value) {
    isSticky.value = true;
  }
  if (value < headerHeight.value) {
    isSticky.value = false;
  }
};

const isSticky = ref(false);

const i18n = useI18n();
const { urlPathname } = usePageContext();

const t = ref(i18n.t);
const headerHeight = ref(70);
const menu = ref([
  {
    text: 'menu.about',
    href: '/about',
    icon: IconInfoCircle,
  },
  {
    text: 'menu.features',
    href: '/features',
    icon: IconPhoneLaptop,
  },
  {
    text: 'menu.pricing',
    href: '/pricing',
    icon: IconMoneyCheck,
  },
  {
    text: 'menu.tutorials',
    href: '/tutorials',
    icon: IconBookOpen,
  },
  {
    text: 'menu.blog',
    href: '/blog',
    icon: IconBlog,
  },
  {
    text: 'menu.faq',
    href: '/faq',
    icon: IconQuestionCircle,
  },
]);
</script>
