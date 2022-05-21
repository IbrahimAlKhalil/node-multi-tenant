<template>
  <div
    :style="{
      width: size + 'px',
      height: size + 'px',
      background: `hsl(${Math.random() * (350 - 1) + 1}, 100%, 49%)`,
    }"
    class="rounded-full border flex items-center justify-center text-light overflow-hidden"
  >
    <img v-show="!!url" :src="url" :alt="text" />
    <p v-show="!!!url" class="uppercase font-bold text-2xl">
      {{ text.charAt(0) }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-avatar',
  props: {
    size: {
      type: Number,
      default: 50,
    },
    url: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
  },
  setup() {
    return;
  },
});
</script>
