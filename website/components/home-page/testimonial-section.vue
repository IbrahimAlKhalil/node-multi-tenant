<template>
  <div class="testimonial-section my-10">
    <div class="container mx-auto">
      <div class="intro text-center mb-5">
        <p class="font-bold text-xl text-text">{{ t(subTitle) }}</p>
        <h3 class="font-bold text-5xl text-primary my-3">{{ t(title) }}</h3>
        <p class="w-4/5 mx-auto text-text">{{ t(description) }}</p>
      </div>

      <div class="testimonials mt-20 w-4/5 mx-auto flex text-center gap-10">
        <!--   ============ Start Item     -->
        <div
          class="testimonials__item relative border border-gray-500 p-5 rounded-lg"
        >
          <div
            class="testimonials__item__icon w-[100px] border rounded-full p-3 border-gray-500 bg-white absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img :src="Icon" alt="testimonial-1" width="100%" />
          </div>
          <div class="testimonials__item__content mt-[50px]">
            <h4 class="font-bold text-2xl text-primary mb-3">
              Lorem ipsum dolor sit amet.
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium commodi dicta dolore eveniet expedita labore odio
              perferendis porro quas rem.
            </p>
          </div>
        </div>
        <!--   ============ End Item     -->
        <!--   ============ Start Item     -->
        <div
          class="testimonials__item relative border border-gray-500 p-5 rounded-lg"
        >
          <div
            class="testimonials__item__icon w-[100px] border rounded-full p-3 border-gray-500 bg-white absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img :src="Icon" alt="testimonial-1" width="100%" />
          </div>
          <div class="testimonials__item__content mt-[50px]">
            <h4 class="font-bold text-2xl text-primary mb-3">
              Lorem ipsum dolor sit amet.
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium commodi dicta dolore eveniet expedita labore odio
              perferendis porro quas rem.
            </p>
          </div>
        </div>
        <!--   ============ End Item     -->
        <!--   ============ Start Item     -->
        <div
          class="testimonials__item relative border border-gray-500 p-5 rounded-lg"
        >
          <div
            class="testimonials__item__icon w-[100px] border rounded-full p-3 border-gray-500 bg-white absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img :src="Icon" alt="testimonial-1" width="100%" />
          </div>
          <div class="testimonials__item__content mt-[50px]">
            <h4 class="font-bold text-2xl text-primary mb-3">
              Lorem ipsum dolor sit amet.
            </h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Accusantium commodi dicta dolore eveniet expedita labore odio
              perferendis porro quas rem.
            </p>
          </div>
        </div>
        <!--   ============ End Item     -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Icon from '#images/quran.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'testimonial-section',
  setup() {
    const i18n = useI18n();

    return {
      description: "homePage['news-letter-section']['description']",
      subTitle: "homePage['news-letter-section']['sub-title']",
      title: "homePage['news-letter-section']['title']",
      button: "homePage['news-letter-section']['button']",
      placeholder: "homePage['news-letter-section']['placeholder']",
      t: i18n.t,
      Icon,
    };
  },
});
</script>
