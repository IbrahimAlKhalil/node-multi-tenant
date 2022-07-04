<template>
  <ul>
    <li v-for="(item, index) of items" :key="index">
      <input
        type="checkbox"
        :checked="item.checked"
        :id="'check-item-' + index"
      />
      <label :for="'check-item' + index">{{ item.text }}</label>
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'editor-checklist',
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
});
</script>
