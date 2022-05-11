<template>
  <div class="my-10 text-text dark:text-light">
    <div
      class="container mx-auto flex flex-col lg:flex-row lg:justify-between items-center gap-20"
    >
      <div
        class="text text-center lg:text-left flex lg:block flex-col items-center"
        style="flex: 1 1 40%"
      >
        <p class="text__subtitle font-bold">
          {{ t("homePage['services-section']['sub-title']") }}
        </p>
        <h3
          class="text__heading text-5xl leading-[1.5] font-bold text-primary dark:text-secondary my-5"
        >
          {{ t("homePage['services-section']['title']") }}
        </h3>
        <p class="text__para text-sm lg:text-justify mb-5">
          {{ t("homePage['services-section']['description']") }}
        </p>
        <secondary-btn :title="t(buttonText)" />
      </div>
      <ul
        class="info-boxes grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-x-10 gap-y-24 py-20"
        style="flex: 1 1 60%"
      >
        <!-- ================= start Item =============== -->
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="info-box__item rounded-xl border border-primary px-5 pt-[60px] pb-[30px] text-center relative"
          data-aos="zoom-in"
          :data-aos-delay="100 * index"
        >
          <div
            class="info-box__icon w-[100px] h-[100px] rounded-full p-5 border bg-white border-primary absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img :src="item.avatar" :alt="t(item.title)" />
          </div>
          <div class="info-box__content">
            <h3 class="info-box__title text-xl font-bold mb-2 text-primary">
              {{ t(item.title) }}
            </h3>
            <p class="info-box__para text-sm text-justify">
              {{ t(item.description) }}
            </p>
          </div>
          <primary-btn
            class="w-2/3 justify-center absolute -bottom-[20px] left-1/2 -translate-x-1/2"
            :title="t(item.button)"
            :icon="item.icon"
            endIcon
          />
        </li>
        <!--- end Item --->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtnVue from '#components/ui/btn/secondary-btn.vue';
import PrimaryBtnVue from '#components/ui/btn/primary-btn.vue';
import ArrowRight from '#icons/solid/arrow-right.svg';
import Item1 from '#images/quran.svg?url';
import { useI18n } from 'vue-i18n';

export default {
  name: 'services-section',
  components: {
    'secondary-btn': SecondaryBtnVue,
    'primary-btn': PrimaryBtnVue,
  },
  setup() {
    const i18n = useI18n();
    const buttonText = "homePage['services-section'].button";
    const items = [
      {
        id: '1',
        avatar: Item1,
        title: "homePage['services-section']['items']['item-1']['title']",
        description:
          "homePage['services-section']['items']['item-1']['description']",
        button: "homePage['services-section']['items']['item-1']['button']",
        icon: ArrowRight,
      },
      {
        id: '2',
        avatar: Item1,
        title: "homePage['services-section']['items']['item-2']['title']",
        description:
          "homePage['services-section']['items']['item-2']['description']",
        button: "homePage['services-section']['items']['item-2']['button']",
        icon: ArrowRight,
      },
      {
        id: '3',
        avatar: Item1,
        title: "homePage['services-section']['items']['item-3']['title']",
        description:
          "homePage['services-section']['items']['item-3']['description']",
        button: "homePage['services-section']['items']['item-3']['button']",
        icon: ArrowRight,
      },
      {
        id: '4',
        avatar: Item1,
        title: "homePage['services-section']['items']['item-4']['title']",
        description:
          "homePage['services-section']['items']['item-4']['description']",
        button: "homePage['services-section']['items']['item-4']['button']",
        icon: ArrowRight,
      },
    ];
    return {
      items,
      t: i18n.t,
      buttonText,
    };
  },
};
</script>
