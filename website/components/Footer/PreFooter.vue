<template>
  <div class="py-3 bg-[#00000060] text-white">
    <p class="text-center">{{ year }} &copy; All Right Reserve</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      year: new Date().getFullYear(),
    };
  },
});
</script>
