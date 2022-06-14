<template>
  <li>
    {{ item.content }}
    <ordered-list v-if="style === 'ordered'" v-show="item.items">
      <list-item v-for="(item, index) of item.items" :key="index">{{
        item.content
      }}</list-item>
    </ordered-list>
    <un-ordered-list v-else v-show="item.items">
      <list-item v-for="(item, index) of item.items" :key="index">{{
        item.content
      }}</list-item>
    </un-ordered-list>
  </li>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Ordered from './ordered.vue';
import UnOrdered from './un-ordered.vue';
export default defineComponent({
  name: 'list-item',
  components: {
    'ordered-list': Ordered,
    'un-ordered-list': UnOrdered,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
});
</script>
<style scoped></style>
