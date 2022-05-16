<template>
  <div class="comment-container container flex gap-3 my-10">
    <div class="comment-avatar">
      <img
        :src="comment.author.avatar"
        alt="avatar"
        class="w-[50px] h-[50px] rounded-full object-cover"
      />
    </div>
    <div class="comment-content flex flex-col gap-3" style="flex: 2">
      <div class="comment-author flex flex-col">
        <span class="comment-author-name font-bold text-xl text-text">{{
          comment.author.name
        }}</span>
        <span class="comment-author-date text-gray-500 text-sm">{{
          comment.date
        }}</span>
      </div>
      <div class="comment-text text-justify text-text">
        {{ comment.text }}
      </div>
      <div class="actions flex items-center gap-5">
        <tooltip-ui :tooltipValue="comment.love">
          <div class="text-red-500 text-3xl cursor-pointer">
            <component
              v-show="!isLoveActive"
              :is="LoveIcon"
              @click="addLove"
            ></component>
            <component
              v-show="isLoveActive"
              :is="LoveSolidIcon"
              @click="removeLove"
            ></component>
          </div>
        </tooltip-ui>
        <secondary-btn
          @handle-click="reply"
          title="Reply"
          size="small"
        ></secondary-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import LoveSolidIcon from '#icons/solid/heart.svg';
import LoveIcon from '#icons/regular/heart.svg';
import { defineComponent, ref } from 'vue';
import TooltipUi from '#components/ui/tooltip.vue';

export default defineComponent({
  name: 'post-single-comment',
  components: {
    TooltipUi,
    SecondaryBtn,
  },

  setup() {
    // States
    const comment = ref({
      author: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/50',
      },
      date: '1 day ago',
      text: 'lorem5 ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      love: 10,
    });
    const isLoveActive = ref(false);

    // Actions
    const addLove = () => {
      isLoveActive.value = true;
      comment.value.love += 1;
    };
    const removeLove = () => {
      isLoveActive.value = false;
      comment.value.love -= 1;
    };
    const reply = () => {
      console.log('reply');
    };
    return {
      isLoveActive,
      LoveSolidIcon,
      addLove,
      removeLove,
      LoveIcon,
      comment,
      reply,
    };
  },
});
</script>
