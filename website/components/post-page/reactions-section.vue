<template>
  <h3 class="text-text text-center text-lg font-bold">
    Was this article helpful?
  </h3>
  <div class="flex justify-center items-center">
    <EmojiLike
      class="scale-[40%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
      @click="$emit('handleClick', 'like')"
    />
    <EmojiWow
      class="scale-[40%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
      @click="$emit('handleClick', 'wow')"
    />
    <EmojiSad
      class="scale-[40%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
      @click="$emit('handleClick', 'sad')"
    />
    <EmojiAngry
      class="scale-[40%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
      @click="$emit('handleClick', 'angry')"
    />
  </div>
</template>

<script lang="ts">
import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
} from '#components/animated-reactions';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'reactions-section',
  components: {
    EmojiLike,
    EmojiAngry,
    EmojiSad,
    EmojiWow,
  },
  emits: ['handleClick'],
});
</script>
