<template>
  <div class="border-b dark:border-b-black">
    <ul class="container flex items-center justify-center gap-2 md:gap-5">
      <slot />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-tabs',
  setup() {
    return;
  },
});
</script>
