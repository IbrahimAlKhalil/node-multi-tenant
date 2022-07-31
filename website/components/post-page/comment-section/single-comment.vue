<template>
  <comment-author
    :data="{
      institute: singleCommentData.institute,
      date: singleCommentData.date_created,
      authorId: singleCommentData.user,
    }"
  />
  <p class="p-2 text-justify text-text dark:text-light">
    {{ singleCommentData.content }}
  </p>
  <!-- <pre>{{ singleCommentData }}</pre> -->
  <comment-reaction
    :commentsReactions="commentsReactions"
    :commentId="singleCommentData.id"
    @handle-reply="handleReply"
    :reactions="reactions"
  />
  <leave-comment
    :mention="singleCommentData.user"
    @update:comment="updateComment"
    :submitComment="submitComment"
    :parent="singleCommentData.id"
    :commentValue="commentValue"
    v-show="isReplying"
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
    singleCommentData: {
      type: Object,
    },
    commentsReactions: {
      type: Array,
      required: true,
      default: () => [],
    },
    commentValue: {
      type: String,
      required: false,
      default: '',
    },
    updateComment: {
      type: Function,
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
    handleReply() {
      this.isReplying = !this.isReplying;
    },
  },
});
</script>
