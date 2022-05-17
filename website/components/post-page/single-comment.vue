<template>
  <div class="flex gap-3 my-10">
    <div class="comment-avatar">
      <img
        :src="avatar"
        alt="avatar"
        class="w-[50px] h-[50px] rounded-full object-cover"
      />
    </div>
    <div class="comment-content flex flex-col gap-3" style="flex: 2">
      <div class="comment-author flex flex-col">
        <span
          class="comment-author-name font-bold text-xl text-text dark:text-light"
          >{{ name }}</span
        >
        <span
          class="comment-author-date text-gray-500 dark:text-gray-300 text-sm"
          >{{ date }}</span
        >
      </div>
      <div class="comment-text text-justify text-text dark:text-light">
        {{ text }}
      </div>
      <div class="actions flex items-center gap-5 pt-5">
        <tooltip-ui :tooltipValue="react">
          <div class="text-red-500 text-3xl cursor-pointer">
            <component
              :is="LoveIcon"
              v-show="!isLoveActive"
              style="bottom: 0"
              @click="$emit('add-love')"
            ></component>
            <component
              v-show="isLoveActive"
              :is="LoveSolidIcon"
              @click="$emit('remove-love')"
              style="bottom: 0"
            ></component>
          </div>
        </tooltip-ui>
        <secondary-btn
          @handle-click="$emit('reply')"
          title="Reply"
          size="small"
        ></secondary-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import TooltipUI from '#components/ui/tooltip.vue';
import LoveSolidIcon from '#icons/solid/heart.svg';
import LoveIcon from '#icons/regular/heart.svg';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'single-comment',
  emits: ['reply', 'add-love', 'remove-love'],
  components: {
    SecondaryBtn,
    'tooltip-ui': TooltipUI,
  },
  props: {
    avatar: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    react: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const isLoveActive = ref(false);
    return {
      LoveSolidIcon,
      isLoveActive,
      LoveIcon,
    };
  },
});
</script>
