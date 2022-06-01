<template>
  <div class="flex items-center gap-2">
    <the-avatar :size="40" :url="avatar" :text="name" />
    <h5 class="font-bold text-text dark:text-light text-xl">{{ name }}</h5>
    <p class="text-sm text-gray-500 dark:text-gray-200">{{ date }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheAvatar from '#components/ui/avatar.vue';

export default defineComponent({
  name: 'comment-author',
  components: { TheAvatar },
  props: {
    avatar: {
      type: String,
    },
    name: {
      type: String,
    },
    date: {
      type: String,
    },
  },
  setup() {
    return;
  },
});
</script>
