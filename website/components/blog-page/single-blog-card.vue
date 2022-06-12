<template>
  <div
    data-aos="zoom-in"
    data-aos-duration="1200"
    class="single-blog displayBox flex flex-col lg:flex-row items-center gap-10 border-t border-gray-100 dark:border-black rounded-lg p-5 bg-white dark:bg-dark shadow-lg"
  >
    <div :class="{ 'lg:order-2': !isOdd }" style="flex: 1">
      <div class="single-blog__image">
        <img :src="image" alt="blog image" class="rounded-lg" />
      </div>
    </div>
    <div style="flex: 1">
      <div class="single-blog__content">
        <h3 class="single-blog__title font-bold text-3xl text-primary mb-2">
          <a :href="link">
            {{ title }}
          </a>
        </h3>
        <div class="single-blog__date text-sm text-gray-500 mb-4">
          <span class="font-bold">{{ dateLabel }}: </span>
          <span class="italic">{{ date }}</span>
        </div>
        <p class="single-blog__text text-md text-text dark:text-light mb-5">
          {{ text }}
        </p>
        <div class="single-blog__action-btn group">
          <a
            :href="link"
            class="flex items-center gap-2 text-secondary transition group-hover:text-secondary-dark"
          >
            <span class="block font-bold text-lg">
              {{ linkText }}
            </span>
            <component
              :is="RightArrow"
              class="text-xl"
              style="bottom: 0"
            ></component>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RightArrow from '#icons/solid/long-arrow-right.svg';

export default defineComponent({
  name: 'single-blog',
  props: {
    title: {
      type: String,
      required: true,
    },
    dateLabel: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    linkText: {
      type: String,
      required: true,
    },
    isOdd: {
      type: Boolean,
      required: true,
    },
  },
  setup: function () {
    return {
      RightArrow,
    };
  },
});
</script>
