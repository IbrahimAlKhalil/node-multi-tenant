<template>
  <div
    class="comment-container container pt-10 border-t border-gray-300 flex flex-col"
  >
    <div
      class="comment-group"
      v-for="comment in commentsData"
      :key="comment.id"
    >
      <single-comment
        :id="comment.id"
        :name="comment.author.name"
        :avatar="comment.author.avatar"
        :date="comment.createdAt"
        :text="comment.content"
        :like="comment.liked"
        :dis-like="comment.disliked"
        @reply="replyComment"
      />
      <div v-for="reply in comment.replies" :key="reply.id" class="ml-[50px]">
        <single-comment
          :id="reply.id"
          :name="reply.author.name"
          :avatar="reply.author.avatar"
          :date="reply.createdAt"
          :text="reply.content"
          :like="reply.liked"
          :dis-like="reply.disliked"
          @reply="replyComment"
        />
        <reply-comment
          :name="userData.name"
          :avatar="userData.avatar"
          v-show="isReplyComment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SingleComment from '#components/post-page/single-comment.vue';
import ReplyComment from '#components/post-page/reply-comment.vue';
import { useComments } from '#stores/comment.store';
import { useAuth } from '#stores/auth.store';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'comments-layout',
  components: { ReplyComment, SingleComment },

  setup() {
    const data = useComments();
    const { user } = useAuth();

    const isReplyComment = ref(false);
    const commentsData = ref(data.data);

    const userData = ref(user);
    console.log('user comment: ', userData.value);

    const replyComment = () => {
      isReplyComment.value = isReplyComment.value ? false : true;
    };
    return {
      isReplyComment,
      commentsData,
      replyComment,
      userData,
    };
  },
});
</script>
