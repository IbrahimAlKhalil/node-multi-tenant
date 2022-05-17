<template>
  <section class="py-8">
    <div class="container flex justify-center items-center gap-5">
      <h5 class="font-bold text-xl text-text dark:text-light">Share With</h5>
      <ul class="flex items-center gap-3 text-2xl">
        <li
          class="w-10 h-10 rounded bg-primary hover:bg-primary-dark dark:bg-secondary hover:dark:bg-secondary-dark text-light flex justify-center items-center cursor-pointer transition"
        >
          <a href="#">
            <component :is="Facebook" style="bottom: 0"></component>
          </a>
        </li>
        <li
          class="w-10 h-10 rounded bg-primary hover:bg-primary-dark dark:bg-secondary hover:dark:bg-secondary-dark text-light flex justify-center items-center cursor-pointer transition"
        >
          <a href="#">
            <component :is="Twitter" style="bottom: 0"></component>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Facebook from '#icons/brands/facebook.svg';
import Twitter from '#icons/brands/twitter.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-share-section',

  setup() {
    return {
      Facebook,
      Twitter,
    };
  },
});
</script>
