<template>
  <section class="my-10">
    <div class="w-9/12 mx-auto">
      <h2
        class="text-3xl text-primary dark:text-secondary font-bold text-center"
      >
        Leave a comment
      </h2>
      <div class="flex flex-col">
        <textarea
          name="comment"
          id="comment"
          cols="30"
          rows="10"
          v-model="commentText"
          class="p-3 my-5 rounded-lg border-2 border-gray-300 focus:border-primary transition outline-none bg-transparent dark:text-light"
        ></textarea>
        <div>
          <primary-btn title="Submit" @handle-click="submitComment" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import { useAuth } from '#stores/auth.store';
import { useComments } from '#stores/comment.store';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'leave-comment-section',
  components: {
    PrimaryBtn,
  },
  setup() {
    const { user } = useAuth();
    const { addComment } = useComments();

    const commentText = ref('');

    const submitComment = (e: Event) => {
      addComment({
        id: '2',
        postId: 1,
        author: {
          name: user.name,
          avatar: user.avatar,
        },
        content: commentText.value,
        createdAt: '2020-01-01',
        liked: 0,
        disliked: 0,
        replies: [],
      });
      commentText.value = '';
    };
    return {
      submitComment,
      commentText,
    };
  },
});
</script>
