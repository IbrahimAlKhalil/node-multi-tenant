<template>
  <div class="comment-group container my-14">
    <single-comment
      :singleCommentData="singleCommentData"
      :commentsReactions="
        commentsReactions.filter(
          (react) => react.comment.id === singleCommentData.id,
        )
      "
      :updateComment="updateComment"
      :submitComment="submitComment"
      :commentValue="commentValue"
      :reactions="reactions"
    />
    <div class="ml-5 mt-8" v-if="singleCommentData.comments">
      <single-comment
        v-for="subCommentData of singleCommentData.comments"
        :key="subCommentData.id"
        :singleCommentData="subCommentData"
        :commentsReactions="
          commentsReactions.filter(
            (reaction) => reaction.comment.id === subCommentData.id,
          )
        "
        :updateComment="updateComment"
        :submitComment="submitComment"
        :commentValue="commentValue"
        :reactions="reactions"
      />
    </div>
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
    updateComment: {
      type: Function,
      required: true,
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
});
</script>
