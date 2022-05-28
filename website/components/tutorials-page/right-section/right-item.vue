<template>
  <li
    class="border-l-2 border-l-gray-200 hover:border-l-primary transition pl-2 my-2 cursor-pointer"
    :class="{ 'border-l-primary': isActive }"
  >
    <a :href="slug">
      {{ title }}
    </a>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'right-item',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
});
</script>
