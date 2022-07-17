<template>
  <button
    class="group border border-secondary hover:bg-secondary transition-all duration-150 text-secondary hover:text-white uppercase font-bold flex items-center"
    @click="$emit('handle-click')"
    :class="{
      'py-2 px-3 rounded-lg gap-2': size === 'medium',
      'py-1 px-3 rounded-md gap-1': size === 'small',
    }"
  >
    <component
      class="inline-block mr-2 text-inherit transition-all duration-150 group-hover:scale-125"
      :is="icon"
    />
    <!-- <img :src="icon" :alt="title" /> -->
    {{ title }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Size } from '#types/component-size';
export default defineComponent({
  name: 'secondary-btn',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: Object,
      required: false,
    },
    size: {
      type: String as () => Size,
      required: false,
      default: 'medium',
    },
  },
  emits: ['handle-click'],
  setup() {
    return {};
  },
});
</script>
