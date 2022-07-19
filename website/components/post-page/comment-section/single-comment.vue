<template>
  <comment-author :name="authorName" :date="publishedDate" :avatar="avatar" />
  <p class="p-2 text-justify text-text dark:text-light">
    {{ commentContent }}
  </p>
  <comment-reaction @handle-reply="handleReply" :reactions="reactions" />
  <leave-comment
    :submitComment="submitComment"
    @update:input="updateComment"
    :commentValue="commentValue"
    v-show="isReplying"
    :parent="commentId"
    :mention="authorId"
    :fluid="true"
  />
</template>

<script lang="ts">
import CommentReaction from '#components/post-page/comment-section/comment-reaction.vue';
import CommentAuthor from '#components/post-page/comment-section/comment-author.vue';
import LeaveComment from '#components/post-page/comment-section/leave-comment.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'single-comment',
  components: { CommentReaction, CommentAuthor, LeaveComment },
  props: {
    commentValue: {
      type: String,
      required: false,
      default: '',
    },
    commentId: {
      type: Number,
      required: true,
    },
    authorId: {
      type: Number,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    commentContent: {
      type: String,
      required: true,
    },
    reactions: {
      type: Array,
      required: true,
    },
    submitComment: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isReplying: false,
      replyComment: '',
    };
  },
  methods: {
    updateComment(value: string) {
      this.replyComment = value;
    },
    handleReply() {
      console.log(this.replyComment);
      this.isReplying = !this.isReplying;
    },
  },
  setup() {
    return;
  },
});
</script>
