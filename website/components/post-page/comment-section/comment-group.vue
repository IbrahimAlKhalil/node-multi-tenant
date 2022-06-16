<template>
  <div class="comment-group container my-10">
    <single-comment
      :handle-reply="handleReply"
      :authorName="
        comment?.user_created?.first_name +
        ' ' +
        comment?.user_created?.last_name
      "
      :publishedDate="comment.date_created.split('T')[0]"
      :avatar="comment?.user_created?.avatar"
      :commentContent="comment.content"
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
    comment: {
      type: Object,
      required: true,
    },
    reactions: {
      type: Array,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
