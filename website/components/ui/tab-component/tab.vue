<template>
  <li
    class="flex items-center gap-2 p-2 cursor-pointer hover:text-primary dark:hover:text-secondary dark:text-light"
    :class="{
      'border-b-2 border-b-primary dark:border-b-secondary text-primary dark:text-secondary':
        isActive,
    }"
    @click="$emit('handle-change', id)"
    v-if="count > 0"
  >
    <component :is="icon"></component>
    <span class="font-bold uppercase">{{ title }}</span>
    <span class="text-sm bg-gray-300 dark:bg-dark rounded px-2">{{
      count
    }}</span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-tab',
  props: ['id', 'icon', 'title', 'count', 'isActive'],
  emits: ['handle-change'],
  setup() {
    return {};
  },
});
</script>
