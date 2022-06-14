<template>
  <h1
    class="font-bold text-2xl lg:text-4xl text-center uppercase mb-2 text-primary dark:text-secondary"
    style="font-family: 'times new roman', serif"
  >
    {{ title }}
  </h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'page-title',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
});
</script>
