<template>
  <div class="w-9/12 mx-auto intro text-center text-text dark:text-light">
    <h1
      class="text-5xl font-bold capitalize mt-10 mb-5 text-primary dark:text-secondary"
    >
      {{ title }}
    </h1>
    <p class="text-gray-500 dark:text-inherit">
      <span class="font-bold"> অথর নাম: </span>
      <span>
        {{ author?.first_name || '' }}
        {{ author?.last_name || '' }}
      </span>
    </p>
    <div class="flex flex-col md:flex-row justify-between items-center text-sm">
      <p class="text-gray-500 dark:text-inherit">
        <span class="font-bold">পাবলিশ সময়: </span>
        <span>
          {{ date }}
        </span>
      </p>
      <p
        class="text-gray-500 dark:text-inherit flex items-center gap-1 pt-5 md:pt-0"
      >
        <a href="/">
          <HomeIcon class="px-1 hover:text-primary" />
        </a>
        <span class="hover:text-primary"><a href="/blog">ব্লগ /</a></span>
        <span class="hover:text-primary">
          <a :href="'/' + categorySlug">{{ categoryName }} /</a></span
        >
        <span
          class="text-primary hover:text-primary-dark dark:text-secondary dark:hover:text-secondary-dark"
        >
          <a :href="'/blog/' + slug">
            {{ title }}
          </a>
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import HomeIcon from '#icons/solid/home-alt.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-intro-section',
  components: { HomeIcon },
  props: {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    categorySlug: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    author: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
