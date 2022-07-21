<template>
  <div class="comment-group container my-10">
    <single-comment
      :singleCommentData="singleCommentData"
      :commentsReactions="commentsReactions"
      :submitComment="submitComment"
      :commentValue="commentValue"
      :reactions="reactions"
    />
  </div>
</template>

<script lang="ts">
import SingleComment from '#components/post-page/comment-section/single-comment.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'comment-group',
  components: { SingleComment },
  props: {
    commentValue: {
      type: String,
      required: false,
      default: '',
    },
    singleCommentData: {
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
    submitComment: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
