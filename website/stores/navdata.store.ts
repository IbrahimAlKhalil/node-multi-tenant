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
        icon: Object.freeze(IconPhoneLaptop),
      },
      {
        text: 'menu.pricing',
        href: '/#pricing',
        icon: Object.freeze(IconMoneyCheck),
      },
      {
        text: 'menu.about',
        href: '/#about',
        icon: Object.freeze(IconInfoCircle),
      },
      {
        text: 'menu.tutorials',
        href: '/tutorials/introduction',
        icon: Object.freeze(IconBookOpen),
      },
      {
        text: 'menu.blog',
        href: '/blog',
        icon: Object.freeze(IconBlog),
      },
      {
        text: 'menu.faq',
        href: '/faq',
        icon: Object.freeze(IconQuestionCircle),
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
