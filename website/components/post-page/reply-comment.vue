<template>
  <div class="flex gap-3 my-10" v-show="isReplyingComment">
    <div class="comment-avatar">
      <img
        :src="avatar"
        alt="avatar"
        class="w-[50px] h-[50px] rounded-full object-cover"
      />
    </div>
    <div style="flex: 2">
      <div class="comment-author flex flex-col">
        <span
          class="comment-author-name font-bold text-xl text-text dark:text-light"
          >{{ name }}</span
        >
      </div>
      <div class="w-full">
        <form class="flex flex-col">
          <textarea
            name="comment"
            id="comment"
            rows="8"
            class="w-full p-3 my-5 rounded-lg border-2 border-gray-300 focus:border-primary transition outline-none bg-transparent dark:text-light"
          ></textarea>
          <div>
            <primary-btn title="Submit" @handle-click.prevent="submitComment" />
            <secondary-btn />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';

export default defineComponent({
  name: 'reply-comment',
  components: {
    SecondaryBtn,
    PrimaryBtn,
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  setup() {
    const isReplyingComment = ref(false);

    const submitComment = () => {
      isReplyingComment.value = false;
    };

    return {
      isReplyingComment,
      submitComment,
    };
  },
});
</script>
