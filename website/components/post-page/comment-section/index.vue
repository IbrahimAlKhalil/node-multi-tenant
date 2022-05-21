<template>
  <leave-comment
    :comment="comment"
    @update:comment="updateComment"
    :submit-comment="submitComment"
    @handle-mention="handleMention"
    :isMentionActive="isMentionActive"
    @close-mention="handleCloseMention"
    :mentionData="mentionData"
    @select-mention-person="selectMentionPerson"
    @open-mention="handleOpenMention"
  />
  <comment-suggestion
    :suggestions="suggestions"
    @select-suggestion="selectSuggestion"
  />
  <comment-group />
  <comment-group />
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
  data() {
    return {
      comment: '',
      suggestions: [
        { id: 1, title: 'Thanks for sharing' },
        { id: 2, title: 'Perfect' },
      ],
      isMentionActive: false,
      mentionData: [
        { id: 1, name: 'Person 1' },
        { id: 2, name: 'Person 2' },
        { id: 3, name: 'Person 3' },
        { id: 4, name: 'Person 4' },
        { id: 5, name: 'Person 5' },
        { id: 6, name: 'Person 6' },
        { id: 6, name: 'Person 7' },
        { id: 6, name: 'Person 8' },
        { id: 7, name: 'Person 6' },
        { id: 8, name: 'Person 6' },
      ],
    };
  },
  methods: {
    updateComment(value: string) {
      this.comment = value;
    },
    handleMention(event: KeyboardEvent) {
      if (event.key === ' ' || event.key === 'Escape') {
        this.isMentionActive = false;
      }
      if (event.key === '@') {
        this.isMentionActive = true;
      }
    },
    handleCloseMention() {
      this.isMentionActive = false;
    },
    handleOpenMention() {
      this.isMentionActive = true;
    },
    submitComment() {
      console.log(this.comment);
      this.comment = '';
    },
    selectSuggestion(value: string) {
      this.comment = value;
    },
    selectMentionPerson(value: string) {
      this.comment = this.comment + value;
    },
  },
  setup() {
    return;
  },
});
</script>
