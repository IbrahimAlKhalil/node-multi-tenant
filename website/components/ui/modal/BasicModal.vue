<template>
  <div class="modal" :class="{ hidden: !dialogVisible }">
    <div class="modal-content bg-light rounded-md">
      <div
        class="modal-header bg-primary-lighter border-b border-primary-light flex justify-between"
      >
        <h2 class="font-bold text-xl text-primary px-5 py-2">Modal Header</h2>
        <span
          @click="$emit('close-modal')"
          class="p-2 font-bold text-xl text-red-500 hover:text-red-600 cursor-pointer"
          >X</span
        >
      </div>
      <div class="modal-body px-5 py-2">
        <p>Some text in the Modal Body</p>
        <p>Some text in the Modal Body</p>
      </div>
      <div class="modal-footer px-5 py-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineEmits(['close-modal']);
defineProps({
  dialogVisible: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped></style>
