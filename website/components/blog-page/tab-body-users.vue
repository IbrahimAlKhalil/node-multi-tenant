<template>
  <div
    class="px-10 py-5 flex flex-col items-center bg-gray-50 min-h-[40vh] max-h-[60vh] overflow-y-auto rt-scrollbar"
  >
    <ul class="grid grid-cols-3 gap-y-5 gap-x-10">
      <slot />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'tab-body-users-container',
});
</script>
