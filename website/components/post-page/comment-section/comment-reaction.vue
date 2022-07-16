<template>
  <div class="flex items-center gap-3 my-3">
    <the-tooltip class="group">
      <ReactionIcon
        class="text-3xl text-gray-500 dark:text-light group-hover:text-text dark:group-hover:text-light transition cursor-pointer"
      />
      <template #tooltip>
        <ul class="flex items-center gap-2 pt-1./">
          <li class="hover:scale-110 cursor-pointer">
            <div
              class="w-8 h-8 flex justify-center items-center overflow-hidden"
            >
              <span>
                <EmojiLike
                  class="scale-[18%] transition duration-300 cursor-pointer grayscale hover:grayscale-0"
                />
              </span>
            </div>
          </li>
          <li class="hover:scale-110 cursor-pointer">
            <div
              class="w-8 h-8 flex justify-center items-center overflow-hidden"
            >
              <span>
                <EmojiWow
                  class="scale-[18%] transition duration-300 cursor-pointer grayscale hover:grayscale-0"
                />
              </span>
            </div>
          </li>
          <li class="hover:scale-110 cursor-pointer">
            <div
              class="w-8 h-8 flex justify-center items-center overflow-hidden"
            >
              <span>
                <EmojiSad
                  class="scale-[18%] transition duration-300 cursor-pointer grayscale hover:grayscale-0"
                />
              </span>
            </div>
          </li>
          <li class="hover:scale-110 cursor-pointer">
            <div
              class="w-8 h-8 flex justify-center items-center overflow-hidden"
            >
              <span>
                <EmojiAngry
                  class="scale-[18%] transition duration-300 cursor-pointer grayscale hover:grayscale-0"
                />
              </span>
            </div>
          </li>
        </ul>
      </template>
    </the-tooltip>
    <ul
      class="flex items-center bg-gray-200 dark:bg-dark-light border border-transparent dark:border-dark rounded"
    >
      <li
        v-for="(reaction, key) in reactionsCount"
        :key="reaction.id"
        class="flex items-center gap-2 px-2 pt-1 pb-0 border-r border-r-gray-50 dark:border-r-gray-700"
        v-show="reaction > 0"
      >
        <div
          v-show="key === 'likes'"
          class="w-8 h-8 flex justify-center items-center overflow-hidden"
        >
          <span>
            <EmojiLike
              class="scale-[18%] transition duration-300 cursor-pointer"
            />
          </span>
        </div>

        <div
          v-show="key === 'wows'"
          class="w-8 h-8 flex justify-center items-center overflow-hidden"
        >
          <span>
            <EmojiWow
              class="scale-[18%] transition duration-300 cursor-pointer"
            />
          </span>
        </div>

        <div
          v-show="key === 'sads'"
          class="w-8 h-8 flex justify-center items-center overflow-hidden"
        >
          <span>
            <EmojiSad
              class="scale-[18%] transition duration-300 cursor-pointer"
            />
          </span>
        </div>

        <div
          v-show="key === 'angries'"
          class="w-8 h-8 flex justify-center items-center overflow-hidden"
        >
          <span>
            <EmojiAngry
              class="scale-[18%] transition duration-300 cursor-pointer"
            />
          </span>
        </div>
        <span class="text-text font-bold text-sm dark:text-light pb-1">{{
          reaction
        }}</span>
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
import ReactionIcon from '#icons/regular/smile-plus.svg';
import TheTooltip from '#components/ui/tooltip.vue';
import { defineComponent } from 'vue';
import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
} from '#components/animated-reactions';

export default defineComponent({
  name: 'comment-reaction',
  components: {
    TheTooltip,
    EmojiLike,
    EmojiAngry,
    EmojiSad,
    EmojiWow,
    ReactionIcon,
  },
  emits: ['handle-reply'],
  props: {
    reactions: {
      type: Array,
      required: true,
    },
  },
  computed: {
    reactionsCount() {
      return this.reactions.reduce(
        (
          acc: { likes: number; wows: number; sads: number; angries: number },
          reaction: any,
        ) => {
          if (reaction.reaction.value === 'like') {
            acc.likes++;
          } else if (reaction.reaction.value === 'wow') {
            acc.wows++;
          } else if (reaction.reaction.value === 'sad') {
            acc.sads++;
          } else if (reaction.reaction.value === 'angry') {
            acc.angries++;
          }
          return acc;
        },
        { likes: 0, wows: 0, sads: 0, angries: 0 },
      );
    },
  },
  setup() {
    return {};
  },
});
</script>
