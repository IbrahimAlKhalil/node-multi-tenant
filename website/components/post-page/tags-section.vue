<template>
  <section class="py-10 text-text dark:text-light text-center">
    <div class="container text-text dark:text-light">
      <h3 class="font-bold text-3xl text-primary dark:text-secondary mb-5">
        Tags
      </h3>
      <div class="tags">
        <ul class="flex justify-center items-center gap-8">
          <li
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item border-y-2 border-l-2 border-primary hover:border-primary-dark dark:border-light dark:hover:border-gray-300 rounded-l-md font-bold box-border flex items-center justify-center py-1 pl-2 pr-4 relative after:border-r-2 after:border-t-2 after:border-primary hover:after:border-primary-dark dark:after:border-light before:bg-gray-300 hover:before:bg-primary dark:before:bg-light dark:hover:before:bg-secondary text-md hover:text-primary dark:hover:text-secondary transition-all duration-300"
          >
            <a :href="tag.link">{{ tag.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-tags-section',
  data() {
    return {
      tags: [
        { name: 'Vue.js', link: '#' },
        { name: 'Vuex', link: '#' },
        { name: 'Vue Router', link: '#' },
        { name: 'Vuex Router Sync', link: '#' },
        { name: 'Vuex Persist', link: '#' },
        { name: 'Vuex-ORM', link: '#' },
      ],
    };
  },
});
</script>

<style scoped>
.tag-item {
  height: 30px;
}
.tag-item::after {
  content: '';
  width: 22px;
  height: 22px;
  display: block;
  position: absolute;
  top: 2px;
  right: -11px;
  transform: rotate(45deg);
  border-radius: 0 0.5rem 0 0;
}
.tag-item::before {
  content: '';
  width: 7px;
  height: 7px;
  display: block;
  position: absolute;
  top: 50%;
  right: -2px;
  transform: translateY(-50%);
  border-radius: 50%;
}
</style>
