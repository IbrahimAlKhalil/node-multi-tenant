<template>
  <ordered-list v-if="style === 'ordered'">
    <list-item v-for="(item, index) of items" :key="index">{{
      item.content
    }}</list-item>
  </ordered-list>
  <un-ordered-list v-else>
    <list-item v-for="(item, index) of items" :key="index">{{
      item.content
    }}</list-item>
  </un-ordered-list>
</template>
<script lang="ts">
import UnOrdered from '#components/editor-js-components/nested-list-type/un-ordered.vue';
import ListItem from '#components/editor-js-components/nested-list-type/list-item.vue';
import Ordered from '#components/editor-js-components/nested-list-type/ordered.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-nested-list',
  components: {
    'un-ordered-list': UnOrdered,
    'ordered-list': Ordered,
    'list-item': ListItem,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    style: {
      type: String,
      required: false,
    },
  },
});
</script>
<style lang=""></style>
