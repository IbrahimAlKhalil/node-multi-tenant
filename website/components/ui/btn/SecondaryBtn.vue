<template>
  <button
    class="group border border-secondary hover:bg-secondary transition-all duration-150 text-secondary hover:text-white py-2 px-3 rounded-lg uppercase font-bold flex items-center gap-2"
  >
    <component
      class="inline-block mr-2 text-inherit transition-all duration-150 group-hover:scale-125"
      :is="icon"
    />
    <!-- <img :src="icon" :alt="title" /> -->
    {{ title }}
  </button>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
  },
});
</script>
