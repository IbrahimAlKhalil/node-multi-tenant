<template>
  <div class="suggestions container my-5">
    <ul class="flex gap-5 items-center flex-wrap">
      <li
        class="px-4 py-1 border border-gray-300 dark:border-dark-light rounded-full cursor-pointer hover:bg-gray-100 dark:bg-dark dark:hover:bg-black text-text dark:text-light transition"
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        @click="$emit('select-suggestion', suggestion.title)"
      >
        {{ suggestion.title }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useComments } from '#stores/comment.store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'comment-suggestion',
  emits: ['select-suggestion'],
  setup() {
    const { suggestions } = useComments();
    return {
      suggestions,
    };
  },
});
</script>
