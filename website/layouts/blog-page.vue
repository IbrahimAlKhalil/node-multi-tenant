<template>
  <div class="container flex">
    <main class="main-area" style="flex: 2 1 85%">
      <slot name="main" />
    </main>
    <aside class="sidebar" style="flex: 1 0 15%">
      <slot name="sidebar" />
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'blog-layout',
  components: {},
});
</script>
