<template>
  <li class="pl-4">
    <span v-html="data.content"></span>
    <ordered-list v-if="type === 'ordered'" v-show="data.items.length">
      <list-item
        v-for="(item, index) of data.items"
        :key="index"
        :data="item"
      ></list-item>
    </ordered-list>
    <un-ordered-list v-else v-show="data.items.length">
      <list-item
        v-for="(item, index) of data.items"
        :key="index"
        :data="item"
      ></list-item>
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
    data: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      default: 'unordered',
    },
  },
});
</script>
