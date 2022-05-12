<template>
  <section
    id="description"
    v-html="postDescription"
    class="container text-justify text-text dark:text-light"
  ></section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-description-section',
  props: ['postDescription'],
  setup() {
    return {};
  },
});
</script>
