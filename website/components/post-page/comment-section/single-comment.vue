<template>
  <comment-author
    :data="{
      date: singleCommentData.date_created,
      authorId: singleCommentData.user,
      institute: singleCommentData.institute,
    }"
  />
  <p class="p-2 text-justify text-text dark:text-light">
    {{ singleCommentData.content }}
  </p>
  <!-- <pre>{{ singleCommentData }}</pre> -->
  <comment-reaction
    @handle-reply="handleReply"
    :reactions="reactions"
    :commentsReactions="commentsReactions"
    :commentId="singleCommentData.id"
  />
  <leave-comment
    :submitComment="submitComment"
    @update:comment="updateComment"
    :commentValue="commentValue"
    v-show="isReplying"
    :parent="singleCommentData.id"
    :mention="singleCommentData.user"
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
