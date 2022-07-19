<template>
  <div class="comment-group container my-10">
    <single-comment
      :authorName="
        singleCommentData?.user_created?.first_name +
        ' ' +
        singleCommentData?.user_created?.last_name
      "
      :publishedDate="singleCommentData.date_created.split('T')[0]"
      :avatar="singleCommentData?.user_created?.avatar"
      :commentContent="singleCommentData.content"
      :reactions="reactions"
      :commentId="singleCommentData.id"
      :authorId="singleCommentData.user"
      :submitComment="submitComment"
      :commentValue="commentValue"
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
