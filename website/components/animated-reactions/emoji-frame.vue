<template>
  <div
    class="flex justify-center items-center overflow-hidden"
    :class="sizeClass"
  >
    <span>
      <slot />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'emoji-frame',
  props: {
    size: {
      type: Number,
      default: 8,
    },
  },
  computed: {
    sizeClass() {
      return `w-${this.size} h-${this.size}`;
    },
  },
});
</script>
