<template>
  <li
    class="rounded hover:bg-gray-50 transition cursor-pointer"
    :class="spacing"
  >
    {{ title }}
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'list-item',
  props: {
    title: {
      type: String,
      required: true,
    },
    spacing: {
      type: String,
      default: 'px-3 py-2',
    },
  },
});
</script>
