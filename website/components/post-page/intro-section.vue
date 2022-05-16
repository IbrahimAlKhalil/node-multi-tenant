<template>
  <div class="w-9/12 mx-auto intro text-center text-text dark:text-light">
    <h1
      class="text-5xl font-bold capitalize mt-10 mb-5 text-primary dark:text-secondary"
    >
      {{ post.title }}
    </h1>
    <p class="text-gray-500 dark:text-inherit">
      <span class="font-bold"> Author: </span>
      <span>
        {{ post.author }}
      </span>
    </p>
    <div class="flex justify-between items-center">
      <p class="text-gray-500 dark:text-inherit">
        <span class="font-bold">Published at: </span>
        <span>
          {{ post.date }}
        </span>
      </p>
      <p class="text-gray-500 dark:text-inherit flex items-center gap-1">
        <component :is="HomeIcon"></component>
        <span>Blog/</span>
        <span>Category Name/</span>
        <span class="text-primary dark:text-secondary">
          {{ post.slug }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HomeIcon from '#icons/solid/home-alt.svg';

export default defineComponent({
  name: 'post-intro-section',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      HomeIcon,
    };
  },
});
</script>
