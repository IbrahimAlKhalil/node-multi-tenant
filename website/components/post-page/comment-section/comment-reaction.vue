<template>
  <div class="flex items-center gap-3 my-3">
    <the-tooltip class="group">
      <component
        :is="ReactionIcon"
        class="text-3xl text-gray-500 dark:text-light group-hover:text-text dark:group-hover:text-light transition cursor-pointer"
      ></component>
      <template #tooltip>
        <ul class="flex items-center gap-2">
          <li class="py-2 px-1 hover:scale-110 cursor-pointer">
            <component :is="ThumbsUp"></component>
          </li>
          <li class="py-2 px-1 hover:scale-110 cursor-pointer">
            <component :is="ThumbsDown"></component>
          </li>
          <li class="py-2 px-1 hover:scale-110 cursor-pointer">
            <component :is="SadIcon"></component>
          </li>
          <li class="py-2 px-1 hover:scale-110 cursor-pointer">
            <component :is="AngryIcon"></component>
          </li>
        </ul>
      </template>
    </the-tooltip>
    <ul
      class="flex items-center bg-gray-200 dark:bg-dark-light border border-transparent dark:border-dark"
    >
      <li
        v-for="(reaction, name) in reactions"
        :key="reaction"
        v-show="reaction > 0"
        class="flex items-center gap-2 px-2 py-1 border-r border-r-gray-50 dark:border-r-gray-700"
      >
        <span v-show="name === 'like'">
          <component :is="ThumbsUp" class="text-blue-500 text-lg"></component>
        </span>
        <span v-show="name === 'dislike'">
          <component
            :is="ThumbsDown"
            class="text-stone-500 text-lg"
          ></component>
        </span>
        <span v-show="name === 'sad'">
          <component
            v-show="name === 'sad'"
            :is="SadIcon"
            class="text-orange-400 text-lg"
          ></component>
        </span>
        <span v-show="name === 'angry'">
          <component
            v-show="name === 'angry'"
            :is="AngryIcon"
            class="text-red-500 text-lg"
          ></component>
        </span>
        <span class="text-text dark:text-light">{{ reaction }}</span>
      </li>
    </ul>
    <button
      class="font-bold text-primary dark:text-secondary hover:text-white dark:hover:text-dark hover:bg-primary dark:hover:bg-secondary uppercase transition duration-150 border border-gray-100 rounded-lg px-3 py-1"
      @click="$emit('handle-reply')"
    >
      Reply
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ReactionIcon from '#icons/regular/smile-plus.svg';
import ThumbsDown from '#icons/solid/thumbs-down.svg';
import TheTooltip from '#components/ui/tooltip.vue';
import ThumbsUp from '#icons/solid/thumbs-up.svg';
import AngryIcon from '#icons/regular/angry.svg';
import SadIcon from '#icons/regular/sad-cry.svg';

export default defineComponent({
  name: 'comment-reaction',
  components: { TheTooltip },
  emits: ['handle-reply'],
  props: {
    reactions: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      ReactionIcon,
      ThumbsDown,
      AngryIcon,
      ThumbsUp,
      SadIcon,
    };
  },
});
</script>
