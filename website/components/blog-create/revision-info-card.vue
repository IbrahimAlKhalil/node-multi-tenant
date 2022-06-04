<template>
  <div class="flex items-stretch gap-1 my-3">
    <div
      class="title text-[10px] font-bold rounded text-white text-center p-1 rotate-180"
      :class="[
        status == 'published'
          ? 'bg-primary'
          : status == 'draft'
          ? 'bg-gray-500'
          : 'bg-secondary',
      ]"
    >
      {{ status }}
    </div>
    <div
      class="info border rounded py-1 px-2 relative flex flex-col justify-center"
      :class="[
        status == 'published'
          ? 'border-primary after:bg-primary'
          : status == 'draft'
          ? 'border-gray-500 after:bg-gray-500'
          : 'border-secondary after:bg-secondary',
      ]"
      style="flex: 2"
    >
      <p>20/05/2022, 03:20:00</p>
      <h6 class="font-bold text-lg">MMR Ahmad</h6>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'revision-info-card',
  props: {
    status: {
      type: String,
      default: 'published',
    },
  },
});
</script>

<style scoped>
.title {
  text-transform: uppercase;
  writing-mode: vertical-lr;
  text-orientation: mixed;
}
.info::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -5px;
}
.info::before {
  content: '';
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -7px;
}
</style>
