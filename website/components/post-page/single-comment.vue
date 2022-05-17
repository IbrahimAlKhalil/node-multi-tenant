<template>
  <div class="comment-container flex gap-3">
    <div class="comment-avatar rounded-full overflow-hidden w-[50px] h-[50px]">
      <img
        :src="comment.author.avatar"
        alt="avatar"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="comment-content flex flex-col">
      <div class="comment-author">
        <span class="comment-author-name block">{{ comment.author.name }}</span>
        <span class="comment-author-date block">{{ comment.date }}</span>
      </div>
      <div class="comment-text">
        {{ comment.text }}
      </div>
      <div class="actions flex items-center gap-5" @click="toggleLove">
        <component v-show="!isLoveActive" :is="LoveIcon"></component>
        <component v-show="isLoveActive" :is="LoveSolidIcon"></component>
        <secondary-btn @handle-click="reply" title="Reply"></secondary-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import LoveSolidIcon from '#icons/solid/heart.svg';
import LoveIcon from '#icons/light/heart.svg';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'post-single-comment',
  components: {
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
    });
    const isLoveActive = ref(false);

    // Actions
    const toggleLove = () => {
      isLoveActive.value = !isLoveActive.value;
    };
    const reply = () => {
      console.log('reply');
    };
    return {
      isLoveActive,
      loveSolidIcon: LoveSolidIcon,
      toggleLove,
      LoveIcon,
      comment,
      reply,
    };
  },
});
</script>
