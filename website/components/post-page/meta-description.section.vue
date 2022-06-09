<template>
  <div
    class="post-page__meta-description w-9/12 mx-auto bg-gray-300 dark:bg-dark text-text dark:text-light text-justify p-8 my-10 rounded-lg"
  >
    <p>
      {{ short_content }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-page-meta-description-section',
  props: {
    short_content: {
      type: String,
      required: false,
    },
  },
  setup() {
    return {};
  },
});
</script>
