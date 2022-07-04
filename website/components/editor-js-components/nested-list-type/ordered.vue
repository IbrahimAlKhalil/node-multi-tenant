<template>
  <ol class="list-decimal list-inside">
    <slot />
  </ol>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ordered-list',
});
</script>
<style scoped></style>
