<template>
  <div class="testimonial-section my-10">
    <div class="container mx-auto">
      <div class="intro text-center mb-5">
        <p class="font-bold text-xl text-text">{{ t(textContent.subTitle) }}</p>
        <h3 class="font-bold text-5xl text-primary my-3">
          {{ t(textContent.title) }}
        </h3>
        <p class="md:w-4/5 mx-auto text-text">
          {{ t(textContent.description) }}
        </p>
      </div>
      <!--  class="testimonials mt-20 flex items-center text-center gap-5" -->
      <div>
        <!--         class="flex justify-center flex-nowrap overflow-hidden gap-10 py-20 testimonials" -->
        <div class="testimonials py-20 text-center">
          <!--   ============ Start Item     -->
          <div
            v-for="item in items"
            :key="item.id"
            class="testimonials__item relative border border-primary p-5 rounded-lg shadow-lg md:mr-10"
          >
            <div
              class="testimonials__item__icon w-[100px] border rounded-full p-3 border-inherit bg-white absolute -top-[50px] left-1/2 -translate-x-1/2"
            >
              <img :src="Icon" alt="testimonial-1" width="100%" />
            </div>
            <div class="testimonials__item__content mt-[50px]">
              <h4 class="font-bold text-2xl text-primary mb-3">
                {{ t(item.title) }}
              </h4>
              <p>
                {{ t(item.description) }}
              </p>
              <div class="author mt-5">
                <p class="font-bold text-xl text-text">{{ t(item.author) }}</p>
                <p class="text-text italic">{{ t(item.company) }}</p>
              </div>
            </div>
          </div>
          <!--   ============ End Item     -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import RightArrow from '#icons/solid/angle-right.svg';
import LeftArrow from '#icons/solid/angle-left.svg';
import Icon from '#images/quran.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Siema from 'siema';

export default defineComponent({
  name: 'testimonial-section',
  //mounted
  mounted() {
    const slider = new Siema({
      selector: '.testimonials',
      duration: 200,
      easing: 'ease-out',
      perPage: 2,
      startIndex: 0,
      draggable: true,
      multipleDrag: false,
      threshold: 20,
      loop: true,
      rtl: false,
      // onInit: () => {},
      // onChange: () => {},
    });
  },
  setup() {
    const i18n = useI18n();
    const textContent = {
      title: "homePage['testimonial-section'].title",
      subTitle: "homePage['testimonial-section'].subTitle",
      description: "homePage['testimonial-section'].description",
    };

    const items = [
      {
        id: 1,
        title: "homePage['testimonial-section']['items']['item-1']['title']",
        description:
          "homePage['testimonial-section']['items']['item-1']['description']",
        author: "homePage['testimonial-section']['items']['item-1']['author']",
        company:
          "homePage['testimonial-section']['items']['item-1']['company']",
      },
      {
        id: 2,
        title: "homePage['testimonial-section']['items']['item-2']['title']",
        description:
          "homePage['testimonial-section']['items']['item-2']['description']",
        author: "homePage['testimonial-section']['items']['item-2']['author']",
        company:
          "homePage['testimonial-section']['items']['item-2']['company']",
      },
      {
        id: 3,
        title: "homePage['testimonial-section']['items']['item-3']['title']",
        description:
          "homePage['testimonial-section']['items']['item-3']['description']",
        author: "homePage['testimonial-section']['items']['item-3']['author']",
        company:
          "homePage['testimonial-section']['items']['item-3']['company']",
      },
    ];

    return {
      t: i18n.t,
      textContent,
      LeftArrow,
      RightArrow,
      items,
      Icon,
    };
  },
});
</script>
