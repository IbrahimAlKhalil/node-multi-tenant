<template>
  <ul class="w-full">
    <slot />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'the-list',
});
</script>
