<template>
  <section
    class="py-10 text-text dark:text-light text-center"
    v-show="tags.length > 0"
  >
    <div class="container text-text dark:text-light">
      <h3 class="font-bold text-3xl text-primary dark:text-secondary mb-5">
        Tags
      </h3>
      <div class="tags">
        <ul class="flex justify-center items-center gap-8">
          <li
            v-for="(tag, index) in tags"
            :key="index"
            class="tag-item border-y-2 border-l-2 border-primary hover:border-primary-dark dark:border-gray-500 dark:hover:border-gray-300 rounded-l-md box-border font-bold text-md hover:text-primary dark:hover:text-secondary flex items-center justify-center py-1 pl-2 pr-4 relative after:border-r-2 after:border-t-2 after:border-primary hover:after:border-primary-dark dark:hover:after:border-gray-300 dark:after:border-gray-500 before:bg-gray-300 hover:before:bg-primary dark:before:bg-light dark:hover:before:bg-secondary transition-all duration-300 cursor-pointer"
          >
            <a :href="'/blog?tag=' + tag.id">{{ tag.tag_id.name }}</a>
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
  props: ['tags'],
  data() {
    return {};
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
