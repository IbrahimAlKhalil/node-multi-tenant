<template>
  <leave-comment
    :submit-comment="submitComment"
    @update:comment="updateComment"
    :commentValue="commentValue"
  />
  <comment-suggestion
    @select-suggestion="selectSuggestion"
    :suggestions="suggestions"
  />
  <comment-group
    :singleCommentData="singleCommentData"
    :commentsReactions="commentsReactions"
    v-for="singleCommentData in data"
    :submitComment="submitComment"
    :updateComment="updateComment"
    :commentValue="commentValue"
    :key="singleCommentData.id"
    :reactions="reactions"
  />
</template>

<script lang="ts">
import CommentSuggestion from '#components/post-page/comment-section/comment-suggestion.vue';
import LeaveComment from '#components/post-page/comment-section/leave-comment.vue';
import CommentGroup from '#components/post-page/comment-section/comment-group.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'comment-section',
  components: {
    CommentSuggestion,
    LeaveComment,
    CommentGroup,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    reactions: {
      type: Array,
      required: true,
    },
    commentsReactions: {
      type: Array,
      required: true,
      default: () => [],
    },
    suggestions: {
      type: Array,
      required: true,
      default: () => [],
    },
    commentValue: {
      type: String,
      required: true,
      default: '',
    },
    updateComment: {
      type: Function,
      required: true,
    },
    submitComment: {
      type: Function,
      required: true,
    },
    selectSuggestion: {
      type: Function,
      required: true,
    },
  },
});
</script>
