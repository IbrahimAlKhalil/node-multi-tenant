<template>
  <div>
    <component :is="CommentIcon"></component>
  </div>
</template>

<script lang="ts">
import CommentIcon from '#icons/regular/comments.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-tab',
  setup() {
    return {
      CommentIcon,
    };
  },
});
</script>
