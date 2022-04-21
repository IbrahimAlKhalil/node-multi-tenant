<template>
  <the-header />
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheHeader from '#layouts/partials/header.vue';

export default defineComponent({
  name: 'layout-main',
  components: { TheHeader },
});
</script>
