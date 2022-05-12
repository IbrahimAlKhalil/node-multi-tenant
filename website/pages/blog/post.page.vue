<template>
  <div class="blog-post">
    <h1>Single Blog</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'blog-post',
  data() {
    return {
      post: null,
    };
  },
});
</script>
