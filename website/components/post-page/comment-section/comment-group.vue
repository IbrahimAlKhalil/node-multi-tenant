<template>
  <div class="comment-group container my-10">
    <single-comment :handle-reply="handleReply" />
    <leave-comment
      v-show="isReplying"
      :fluid="true"
      submit-comment="submitComment"
      @update:input="updateComment"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleComment from '#components/post-page/comment-section/single-comment.vue';
import LeaveComment from '#components/post-page/comment-section/leave-comment.vue';

export default defineComponent({
  name: 'comment-group',
  components: { SingleComment, LeaveComment },
  data() {
    return {
      isReplying: false,
      comment: '',
    };
  },
  methods: {
    updateComment(value: string) {
      this.comment = value;
    },
    handleReply() {
      this.isReplying = !this.isReplying;
    },
    submitComment() {
      console.log(this.comment);
      this.comment = '';
    },
  },
  setup() {
    return;
  },
});
</script>
