<template>
  <div
    class="comment-container container pt-10 border-t border-gray-300 flex flex-col"
  >
    <div
      class="comment-group"
      v-for="comment in commentsData"
      :key="comment.id"
    >
      <comment-group :comment="comment" />
    </div>
  </div>
</template>

<script lang="ts">
import CommentGroup from '#layouts/partials/comment/comment-group.vue';
import { useComments } from '#stores/comment.store';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'comments-layout',
  components: { CommentGroup },

  setup() {
    const data = useComments();
    const commentsData = ref(data.data);

    return {
      commentsData,
    };
  },
});
</script>
