<template>
  <div
    :class="{
      'border-gray-200 dark:border-black bg-gray-50 dark:bg-dark text-text dark:text-light':
        !isActive,
      'bg-primary dark:bg-secondary border-primary dark:border-secondary-dark text-white':
        isActive,
    }"
    class="p-1 border hover:border-primary hover:bg-primary hover:text-white font-bold transition-all rounded min-w-[30px] text-center cursor-pointer"
  >
    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'pagination-item',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
