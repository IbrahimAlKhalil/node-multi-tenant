<template>
  <header
    class="h-[76px] px-14 py-3 bg-[#ecf5ff] flex shadow sticky top-0 justify-between items-center"
  >
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

    <nav>
      <ul class="flex items-center">
        <li class="m-0 p-0" v-for="item in menu" :key="item.href">
          <a :href="item.href" class="ml-1 p-2 rounded-sm hover:text-primary">
            <component class="inline-block mr-1" :is="item.icon" />

            {{ t(item.text) }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import IconQuestionCircle from '#icons/duotone/question-circle.svg';
import IconPhoneLaptop from '#icons/duotone/phone-laptop.svg';
import IconInfoCircle from '#icons/duotone/info-circle.svg';
import IconMoneyCheck from '#icons/duotone/money-check.svg';
import IconBookOpen from '#icons/duotone/book-open.svg';
import IconBlog from '#icons/duotone/blog.svg';
import LogoIcon from '#images/icon.svg?url';
import Logo from '#images/logo.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'the-header',
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
    };
  },
});
</script>
