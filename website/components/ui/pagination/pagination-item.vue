<template>
  <div
    :class="{
      'border-gray-200 bg-gray-50 text-text': !isActive,
      'bg-primary border-primary text-white': isActive,
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
