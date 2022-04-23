<template>
  <header class="flex justify-between items-center container mx-auto py-3">
    <div class="logo h-[76px]">
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
    </div>

    <nav class="nav flex-grow">
      <ul class="flex items-center justify-center">
        <li class="m-0 p-0 group" v-for="item in menu" :key="item.href">
          <a
            :href="item.href"
            class="ml-2 p-2 rounded-sm group-hover:text-primary font-bold text-md text-text transition-all duration-150"
            :class="{ 'text-primary': item.href === currentPath }"
          >
            <component
              class="inline-block mr-2 text-inherit group-hover:scale-150 transition-all duration-300"
              :class="{ 'scale-150': item.href === currentPath }"
              :is="item.icon"
            />

            {{ t(item.text) }}
          </a>
        </li>
      </ul>
    </nav>
    <div class="action-area">
      <primary-btn :title="t('common.login')" :icon="LoginWhite" />
    </div>
  </header>
</template>

<script lang="ts">
import PrimaryBtnVue from '#components/ui/btn/PrimaryBtn.vue';
import IconBlog from '#icons/duotone/blog.svg';
import IconBookOpen from '#icons/duotone/book-open.svg';
import IconInfoCircle from '#icons/duotone/info-circle.svg';
import IconMoneyCheck from '#icons/duotone/money-check.svg';
import IconPhoneLaptop from '#icons/duotone/phone-laptop.svg';
import IconQuestionCircle from '#icons/duotone/question-circle.svg';
import LoginWhite from '#icons/others/login-white.svg?url';
import LogoIcon from '#images/icon.svg?url';
import Logo from '#images/logo.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'the-header',
  components: {
    'primary-btn': PrimaryBtnVue,
  },
  setup() {
    const i18n = useI18n();
    const menu = [
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
    ];

    return {
      t: i18n.t,
      LogoIcon,
      Logo,
      menu,
      LoginWhite,
    };
  },
});
</script>
