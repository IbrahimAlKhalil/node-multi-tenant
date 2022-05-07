<template>
  <div class="container flex gap-5 mb-10">
    <main class="main-area" style="flex: 2 1 75%">
      <slot name="main" />
    </main>
    <aside class="sidebar hidden md:block" style="flex: 1 0 25%">
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
