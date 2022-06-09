<template>
  <div class="blog-area">
    <div class="flex flex-col gap-10">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-blogs',
});
</script>
