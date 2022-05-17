<template>
  <button
    class="group border border-secondary hover:bg-secondary transition-all duration-150 text-secondary hover:text-white py-2 px-3 rounded-lg uppercase font-bold flex items-center gap-2"
    @click="$emit('handle-click')"
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
export default defineComponent({
  name: 'secondary-btn',
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
  },
  emits: ['handle-click'],
  setup() {
    return {};
  },
});
</script>
