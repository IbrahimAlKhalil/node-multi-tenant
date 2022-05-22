<template>
  <div class="tooltip">
    <slot />
    <div class="tooltip__area bg-text text-light after:bg-text">
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-tooltip',
  setup() {
    return;
  },
});
</script>

<style scoped>
.tooltip {
  position: relative;
}
.tooltip__area {
  position: absolute;
  width: 100%;
  min-width: max-content;
  top: -150%;
  left: 0;
  padding: 2px 5px;
  border-radius: 0.25rem;
  z-index: 2;
  opacity: 0;
}
.tooltip__area::after {
  content: '';
  width: 15px;
  height: 15px;
  position: absolute;
  bottom: -8px;
  left: 8px;
  transform: rotate(45deg);
  z-index: -1;
}
.tooltip:hover .tooltip__area {
  opacity: 1;
}
</style>
