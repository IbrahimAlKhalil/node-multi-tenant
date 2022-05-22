<template>
  <button
    class="group bg-primary hover:bg-primary-dark transition duration-300 text-white py-2 px-3 rounded-lg uppercase font-bold flex items-center gap-2"
    @click="$emit('handle-click')"
    :class="{
      'py-2 px-3 rounded-lg gap-2': size === 'medium',
      'py-1 px-3 rounded-md gap-1': size === 'small',
    }"
  >
    <component
      class="inline-block mr-2 text-inherit transition-all duration-300 group-hover:scale-125"
      :class="{ 'order-2': endIcon }"
      :is="icon"
    />
    <!-- <img :src="icon" :alt="title" /> -->
    {{ title }}
  </button>
</template>

<script lang="ts" setup>
import { Size } from '#types/component-size';

defineEmits(['handle-click']);
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
  endIcon: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String as () => Size,
    required: false,
    default: 'medium',
  },
});
</script>
