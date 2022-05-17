<template>
  <div
    class="comment-container container pt-10 border-t border-gray-300 flex flex-col"
  >
    <div class="comment-group" v-for="comment in comments" :key="comment.id">
      <single-comment
        :name="comment.author.name"
        :avatar="comment.author.avatar"
        :date="comment.createdAt"
        :text="comment.content"
        :react="comment.react"
        @reply="replyComment"
        @add-love="addLove"
        @remove-love="removeLove"
      />
      <div v-for="reply in comment.replies" :key="reply.id">
        <single-comment
          :name="reply.author.name"
          :avatar="reply.author.avatar"
          :date="reply.createdAt"
          :text="reply.content"
          :react="reply.react"
        />
      </div>
      <reply-comment v-show="isReplyComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SingleComment from '#components/post-page/single-comment.vue';
import ReplyComment from '#components/post-page/reply-comment.vue';
import { comment } from '#types/comment-type';

export default defineComponent({
  name: 'comments-layout',
  components: { ReplyComment, SingleComment },
  props: {
    comments: {
      type: Array as () => comment[],
      required: true,
    },
  },
  setup() {
    const isReplyComment = ref(false);
    const replyComment = () => {
      isReplyComment.value = true;
    };
    return {
      isReplyComment,
      replyComment,
    };
  },
});
</script>
