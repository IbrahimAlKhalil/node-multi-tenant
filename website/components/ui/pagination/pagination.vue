<template>
  <div class="flex justify-center gap-1">
    <pagination-item
      v-for="(item, index) in total"
      :key="index"
      :title="item"
      :isActive="item === activePage"
      :urlWithKey="urlWithKey"
      @change-pagination="handleChangePage"
    ></pagination-item>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import PaginationItem from './pagination-item.vue';

export default defineComponent({
  name: 'the-pagination',
  components: { PaginationItem },
  emits: ['change-page'],
  props: {
    total: {
      type: Number,
      default: 0,
    },
    activePage: {
      type: Number,
      default: 1,
    },
    urlWithKey: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleChangePage(page: number) {
      this.$emit('change-page', page);
    },
  },
});
</script>
