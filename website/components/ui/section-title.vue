<template>
  <h3
    class="font-bold text-4xl md:text-5xl leading-normal text-primary dark:text-secondary my-5"
  >
    <slot />
  </h3>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'section-title',
});
</script>
