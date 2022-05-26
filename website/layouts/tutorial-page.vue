<template>
  <layout-main>
    <div class="flex justify-between" style="padding-top: var(--header-height)">
      <div class="left-sidebar w-1/5 min-h-full bg-gray-100">
        <slot name="left-sidebar" />
      </div>
      <div class="main-body grow p-5">
        <slot />
      </div>
    </div>
  </layout-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LayoutMain from '#layouts/main.vue';

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
