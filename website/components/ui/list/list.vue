<template>
  <ul class="w-full mt-2">
    <slot />
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'the-list',
});
</script>
