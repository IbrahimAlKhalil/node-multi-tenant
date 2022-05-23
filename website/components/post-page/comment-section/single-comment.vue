<template>
  <comment-author :name="authorName" :date="publishedDate" :avatar="avatar" />
  <p class="p-2 text-justify text-text">
    {{ commentContent }}
  </p>
  <comment-reaction @handle-reply="handleReply" :reactions="reactions" />
  <leave-comment
    v-show="isReplying"
    :fluid="true"
    submit-comment="submitComment"
    @update:input="updateComment"
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
      required: true,
    },
    commentContent: {
      type: String,
      required: true,
    },
    reactions: {
      type: Object,
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
      this.isReplying = !this.isReplying;
    },
    submitComment() {
      console.log(this.replyComment);
      this.replyComment = '';
    },
  },
  setup() {
    return;
  },
});
</script>
