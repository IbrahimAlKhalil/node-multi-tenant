import IconQuestionCircle from '#icons/duotone/question-circle.svg';
import IconPhoneLaptop from '#icons/duotone/phone-laptop.svg';
import IconMoneyCheck from '#icons/duotone/money-check.svg';
import IconInfoCircle from '#icons/duotone/info-circle.svg';
import IconBookOpen from '#icons/duotone/book-open.svg';
import IconBlog from '#icons/duotone/blog.svg';
import { defineStore } from 'pinia';

export const useNavData = defineStore('navdata', {
  state: () => ({
    data: [
      {
        text: 'menu.features',
        href: '/#features',
        icon: IconPhoneLaptop,
      },
      {
        text: 'menu.pricing',
        href: '/#pricing',
        icon: IconMoneyCheck,
      },
      {
        text: 'menu.about',
        href: '/#about',
        icon: IconInfoCircle,
      },
      {
        text: 'menu.tutorials',
        href: '/tutorials/introduction',
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
    ],
    currentPath: '',
  }),
  actions: {
    setCurrentPath(path: string) {
      this.currentPath = path;
    },
  },
});
