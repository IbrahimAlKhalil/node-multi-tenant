<template>
  <ul class="px-5">
    <slot />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'right-section-container',
});
</script>
