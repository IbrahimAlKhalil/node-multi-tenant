<template>
  <button
    class="bg-primary text-white py-2 px-3 rounded-lg uppercase font-bold flex items-center gap-2"
  >
    <img :src="icon" :alt="title" />
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
    required: true,
  },
});
</script>
