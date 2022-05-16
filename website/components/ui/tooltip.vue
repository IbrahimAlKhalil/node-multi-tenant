<template>
  <div class="relative">
    <slot />
    <div
      class="w-[18px] h-[18px] p-1 absolute -top-3 -right-3 bg-primary rounded-full flex items-center justify-center"
    >
      <p class="text-[10px] text-white text-center font-bold">
        <span>{{ tooltipValue > 99 ? 99 : tooltipValue }}</span
        ><sup v-show="tooltipValue > 99">+</sup>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tooltip-ui',
  props: {
    tooltipValue: {
      type: Number,
      default: 0,
    },
  },
});
</script>
