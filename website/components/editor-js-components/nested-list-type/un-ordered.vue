<template>
  <ul class="list-disc list-inside">
    <slot />
  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'un-ordered-list',
});
</script>
<style scoped></style>
