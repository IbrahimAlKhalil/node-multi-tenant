<template>
  <ordered-list v-if="data.style === 'ordered'">
    <list-item
      v-for="(item, index) of data.items"
      :key="index"
      :data="item"
      :type="data.style"
    ></list-item>
  </ordered-list>
  <un-ordered-list v-else>
    <list-item
      v-for="(item, index) of data.items"
      :key="index"
      :data="item"
      :type="data.style"
    ></list-item>
  </un-ordered-list>
</template>
<script lang="ts">
import UnOrdered from '#components/editor-js-components/nested-list-type/un-ordered.vue';
import ListItem from '#components/editor-js-components/nested-list-type/list-item.vue';
import Ordered from '#components/editor-js-components/nested-list-type/ordered.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'editor-nestedlist',
  components: {
    'un-ordered-list': UnOrdered,
    'ordered-list': Ordered,
    'list-item': ListItem,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
});
</script>
