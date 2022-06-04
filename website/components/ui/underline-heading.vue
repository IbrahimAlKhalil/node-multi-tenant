<template>
  <h4
    class="widget-title text-2xl font-bold border-b-2 border-gray-500 pb-2 mb-5 relative after:h-2 after:w-1/2 after:absolute after:left-1/2 after:lg:left-0 after:-bottom-1 after:rounded after:lg:rounded-l-none after:-translate-x-1/2 after:lg:-translate-x-0"
    :class="[
      color === 'primary'
        ? 'after:bg-primary text-primary'
        : 'after:bg-secondary text-white',
    ]"
  >
    {{ title }}
  </h4>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    default: '',
    required: true,
  },
  color: {
    type: String,
    default: 'secondary',
  },
});
</script>
