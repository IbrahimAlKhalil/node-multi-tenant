<template>
  <leave-comment
    :commentValue="commentValue"
    @update:comment="updateComment"
    :submit-comment="submitComment"
  />
  <comment-suggestion
    :suggestions="suggestions"
    @select-suggestion="selectSuggestion"
  />
  <comment-group
    v-for="singleCommentData in data"
    :reactions="
      reactions.filter((react) => react.comment.id === singleCommentData.id)
    "
    :key="singleCommentData.id"
    :singleCommentData="singleCommentData"
    :submitComment="submitComment"
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
