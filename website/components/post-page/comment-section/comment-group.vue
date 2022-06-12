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
    <!-- <div
      class="pl-10 py-3 border-l-2 border-l-gray-200 dark:border-l-black bg-gray-50 dark:bg-dark"
    >
      <single-comment
        v-for="reply in comment.replies"
        :key="reply.id"
        :handle-reply="handleReply"
        :authorName="reply.author.name"
        :publishedDate="reply.createdAt"
        :avatar="reply.author.avatar"
        :commentContent="reply.content"
        :reactions="reply.reactions"
      />
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleComment from '#components/post-page/comment-section/single-comment.vue';

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
