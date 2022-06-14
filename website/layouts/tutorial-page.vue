<template>
  <layout-main>
    <div class="h-screen flex" style="margin-top: var(--header-height)">
      <div
        class="w-max h-full bg-gray-200 dark:bg-dark text-text dark:text-light overflow-y-auto rt-scrollbar"
      >
        <slot name="left-sidebar" />
      </div>
      <div
        class="h-full max-w-full overflow-y-auto pr-5 scrollbar text-text dark:text-light"
        style="flex: 2; scrollbar-width: 0"
      >
        <slot name="main" />
      </div>
      <div
        class="h-full bg-blue-50 dark:bg-dark text-text dark:text-light"
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

<style scoped>
/* Scrollbar Style */
.scrollbar::-webkit-scrollbar {
  width: 0.25rem;
  height: 5px;
}

/* scrollbar-thumb */
.scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

/* scrollbar-track */
.scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
</style>
