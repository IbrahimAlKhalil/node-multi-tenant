<template>
  <h3 class="text-text dark:text-light text-center text-lg font-bold mb-5">
    এই প্রবন্ধটা কি সাহায্যকর ছিল?
  </h3>
  <div class="flex justify-center items-center">
    <emoji-frame :size="12" v-for="emoji of reactions" :key="emoji.id">
      <component
        :is="'Emoji' + emoji.type"
        :id="emoji.id"
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @handle-click="handleClickReaction"
      ></component>
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
  props: ['reactions', 'handleClickReaction'],
  setup() {
    return {};
  },
});
</script>
