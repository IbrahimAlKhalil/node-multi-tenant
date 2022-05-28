<template>
  <layout-main>
    <div class="w-full h-screen flex" style="margin-top: var(--header-height)">
      <div
        class="w-1/5 h-full bg-gray-200 overflow-y-auto rt-scrollbar"
        style="flex: 1"
      >
        <slot name="left-sidebar" />
      </div>
      <div
        class="h-full bg-gray-100 overflow-y-auto rt-scrollbar"
        style="flex: 2"
      >
        <slot />
      </div>
      <div
        class="h-full bg-blue-50 overflow-y-auto rt-scrollbar"
        style="min-width: 250px"
      >
        <slot name="right-sidebar" />
      </div>
    </div>
  </layout-main>
</template>

<script lang="ts">
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    LayoutMain,
  },

  setup() {
    return {};
  },
});
</script>
