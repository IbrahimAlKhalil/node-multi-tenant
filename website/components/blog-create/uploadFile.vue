<template>
  <div
    class="border-2 border-dashed rounded-lg border-gray-400 p-3 cursor-pointer"
  >
    <img :src="uploadIcon" alt="Upload Icon" class="opacity-40" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import uploadIcon from '#images/upload-icon.svg?url';
export default defineComponent({
  name: 'upload-file',

  setup() {
    return {
      uploadIcon,
    };
  },
});
</script>
