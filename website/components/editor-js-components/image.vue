<template>
  <img :src="data.file.url" :alt="data.file.title" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-image',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped></style>
