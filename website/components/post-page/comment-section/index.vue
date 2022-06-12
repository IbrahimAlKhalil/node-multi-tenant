<template>
  <leave-comment
    :comment="comment"
    @update:comment="updateComment"
    :submit-comment="submitComment"
  />
  <comment-suggestion @select-suggestion="selectSuggestion" />
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
import { useComments } from '#stores/comment.store';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'comment-section',
  components: {
    CommentSuggestion,
    LeaveComment,
    CommentGroup,
  },
  data() {
    return {
      comment: '',
    };
  },
  props: ['data', 'reactions'],
  methods: {
    updateComment(value: string) {
      this.comment = value;
    },
    submitComment() {
      console.log(this.comment);
      this.comment = '';
    },
    selectSuggestion(value: string) {
      this.comment = this.comment + ' ' + value;
    },
  },
  setup() {
    const { comments } = useComments();
    return {
      comments,
    };
  },
});
</script>
