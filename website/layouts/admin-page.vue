<template>
  <layout-main>
    <div class="container flex h-full">
      <div
        style="flex: 2; padding-top: calc(var(--header-height) + 20px)"
        class="px-5"
      >
        <slot />
      </div>
      <div
        style="padding-top: calc(var(--header-height) + 20px)"
        class="w-3/12 min-w-[350px] h-full bg-blue-50 p-3"
      >
        <slot name="sidebar" />
      </div>
    </div>
  </layout-main>
</template>

<script lang="ts">
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'admin-page-layout',
  components: {
    LayoutMain,
  },
  setup() {
    return {};
  },
});
</script>
