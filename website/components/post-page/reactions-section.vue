<template>
  <h3 class="text-text text-center text-lg font-bold">
    Was this article helpful?
  </h3>
  <div class="flex justify-center items-center">
    <emoji-frame :size="12">
      <EmojiLike
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @click="$emit('handleClick', 'like')"
      />
    </emoji-frame>
    <emoji-frame :size="12">
      <EmojiWow
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @click="$emit('handleClick', 'wow')"
      />
    </emoji-frame>
    <emoji-frame :size="12">
      <EmojiSad
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @click="$emit('handleClick', 'sad')"
      />
    </emoji-frame>
    <emoji-frame :size="12">
      <EmojiAngry
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @click="$emit('handleClick', 'angry')"
      />
    </emoji-frame>
  </div>
</template>

<script lang="ts">
import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
  EmojiFrame,
} from '#components/animated-reactions';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'reactions-section',
  components: {
    EmojiLike,
    EmojiAngry,
    EmojiSad,
    EmojiWow,
    EmojiFrame,
  },
  emits: ['handleClick'],
});
</script>
