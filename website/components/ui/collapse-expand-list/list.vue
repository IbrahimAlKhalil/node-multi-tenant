<template>
  <ul class="w-full">
    <list-item
      v-for="item of items"
      :key="item.id"
      :item="item"
      :postCategory="postCategory"
    />
  </ul>
</template>

<script lang="ts">
import ListItem from './list-item.vue';
import { defineComponent } from 'vue';

type listItems = {
  id: string;
  title: string;
};

export default defineComponent({
  name: 'collapse-expand-list',
  components: {
    ListItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [] as listItems[],
    },
    postCategory: {
      type: Object,
      default: () => ({}),
    },
  },
});
</script>
