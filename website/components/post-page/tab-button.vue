<template>
  <div class="w-8 h-8 flex justify-center items-center overflow-hidden">
    <span>
      <EmojiLike
        v-if="title === 'Like'"
        class="scale-[18%] transition duration-300 cursor-pointer"
        :class="[
          title.toLowerCase() !== activeTab ? 'grayscale' : 'grayscale-0',
        ]"
      />
      <EmojiWow
        v-if="title === 'Wow'"
        class="scale-[18%] transition duration-300 cursor-pointer"
        :class="[
          title.toLowerCase() !== activeTab ? 'grayscale' : 'grayscale-0',
        ]"
      />
      <EmojiSad
        v-if="title === 'Sad'"
        class="scale-[18%] transition duration-300 cursor-pointer"
        :class="[
          title.toLowerCase() !== activeTab ? 'grayscale' : 'grayscale-0',
        ]"
      />
      <EmojiAngry
        v-if="title === 'Angry'"
        class="scale-[18%] transition duration-300 cursor-pointer"
        :class="[
          title.toLowerCase() !== activeTab ? 'grayscale' : 'grayscale-0',
        ]"
      />
    </span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
} from '#components/animated-reactions';
import { number } from 'yup';

export default defineComponent({
  name: 'tab-button',
  components: {
    EmojiLike,
    EmojiAngry,
    EmojiSad,
    EmojiWow,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    activeTab: {
      type: String,
      required: true,
    },
    reactionsCount: {
      type: Number,
      required: true,
    },
  },
});
</script>
