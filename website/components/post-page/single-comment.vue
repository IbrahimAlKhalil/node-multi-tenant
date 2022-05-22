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
        <tooltip-ui :tooltipValue="like" position="top-left">
          <component
            :is="LikeLine"
            style="bottom: 0"
            @click="() => handleLike(id)"
            class="text-2xl cursor-pointer"
            :class="{ 'text-blue-500': isLiked, 'text-gray-500': !isLiked }"
          ></component>
        </tooltip-ui>
        <tooltip-ui :tooltipValue="disLike">
          <component
            :is="DisLikeLine"
            style="bottom: 0"
            @click="() => handleDisLike(id)"
            class="text-2xl cursor-pointer"
            :class="{
              'text-red-500': isDisLiked,
              'text-gray-500': !isDisLiked,
            }"
          ></component>
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
import DisLikeLine from '#icons/regular/thumbs-down.svg';
import DisLikeSolid from '#icons/solid/thumbs-down.svg';
import TooltipUI from '#components/ui/badge.vue';
import likeSolid from '#icons/solid/thumbs-up.svg';
import LikeLine from '#icons/regular/thumbs-up.svg';
import { useComments } from '#stores/comment.store';

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'single-comment',
  emits: ['reply'],
  components: {
    SecondaryBtn,
    'tooltip-ui': TooltipUI,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
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
    like: {
      type: Number,
      required: true,
    },
    disLike: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const { addLike, removeLike, addDislike, removeDislike } = useComments();
    const handleLike = (id: string) => {
      if (isLiked.value === true) {
        removeLike(id);
        isLiked.value = false;
      } else {
        if (isDisLiked.value === true) {
          removeDislike(id);
          isDisLiked.value = false;
        }
        addLike(id);
        isLiked.value = true;
      }
    };
    const handleDisLike = (id: string) => {
      if (isDisLiked.value) {
        removeDislike(id);
        isDisLiked.value = false;
      } else {
        if (isLiked.value) {
          removeLike(id);
          isLiked.value = false;
        }
        addDislike(id);
        isDisLiked.value = true;
      }
    };
    const isLiked = ref(false);
    const isDisLiked = ref(false);

    return {
      handleDisLike,
      DisLikeSolid,
      DisLikeLine,
      isDisLiked,
      handleLike,
      likeSolid,
      LikeLine,
      isLiked,
    };
  },
});
</script>
