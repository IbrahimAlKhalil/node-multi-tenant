<template>
  <div>
    <the-header />
    <slot />
  </div>
</template>

<script lang="ts">
import TheHeader from '#layouts/partials/header.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'layout-main',
  components: { TheHeader },
});
</script>
