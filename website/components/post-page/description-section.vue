<template>
  <section
    id="description"
    v-html="postDescription"
    class="w-9/12 mx-auto text-justify text-text dark:text-light"
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

<style scoped>
h3 {
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  text-align: center;
}
p {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
