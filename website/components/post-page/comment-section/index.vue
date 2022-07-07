<template>
  <leave-comment
    :comment="comment"
    @update:comment="updateComment"
    :submit-comment="submitComment"
  />
  <comment-suggestion
    :suggestions="suggestions"
    @select-suggestion="selectSuggestion"
  />
  <comment-group
    v-for="comment in data"
    :reactions="reactions.filter((react) => react.comment.id === comment.id)"
    :key="comment.id"
    :comment="comment"
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
  props: [
    'data',
    'reactions',
    'suggestions',
    'comment',
    'updateComment',
    'submitComment',
    'selectSuggestion',
  ],
  setup() {
    return {};
  },
});
</script>
