<template>
  <div
    class="single-blog flex items-center gap-10 border-t border-gray-100 rounded-lg p-5 bg-white shadow-lg"
  >
    <div :class="{ 'order-2': !isOdd }" style="flex: 1">
      <div class="single-blog__image">
        <img :src="image" alt="blog image" class="rounded-lg" />
      </div>
    </div>
    <div style="flex: 1">
      <div class="single-blog__content">
        <h3 class="single-blog__title font-bold text-3xl text-primary mb-3">
          {{ title }}
        </h3>
        <div class="single-blog__date text-gray-500 italic mb-3">
          {{ date }}
        </div>
        <p class="single-blog__text text-md text-text mb-5">
          {{ text }}
        </p>
        <div class="single-blog__action-btn">
          <a :href="link">
            <button
              class="border border-secondary hover:bg-secondary rounded-md font-bold text-xl text-secondary hover:bg-secondary-dark hover:text-white px-4 py-1 rounded-md"
            >
              {{ linkText }}
            </button>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';

import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'single-blog',
  props: {
    title: {
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
    const i18n = useI18n();
    return {
      t: i18n.t,
    };
  },
});
</script>
