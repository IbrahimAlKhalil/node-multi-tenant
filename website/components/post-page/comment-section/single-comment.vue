<template>
  <comment-author
    name="Ahmad"
    date="2022-05-21"
    avatar="https://i.pravatar.cc/300?img=2"
  />
  <p class="p-2 text-justify text-text">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos
    dolores esse illum inventore molestiae odio omnis quod, repellat repellendus
    soluta.
  </p>
  <comment-reaction @handle-reply="handleReply" />
</template>

<script lang="ts">
import CommentReaction from '#components/post-page/comment-section/comment-reaction.vue';
import CommentAuthor from '#components/post-page/comment-section/comment-author.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'single-comment',
  components: { CommentReaction, CommentAuthor },
  props: {
    handleReply: {
      type: Function,
      required: true,
    },
  },
  setup() {
    return;
  },
});
</script>
