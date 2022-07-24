<template>
  <li
    v-for="item of postReactions"
    :key="item.id"
    class="flex items-center gap-2 text-text dark:text-light text-lg"
  >
    <div
      class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex justify-center items-center"
    >
      <img
        v-show="item?.user_created?.avatar"
        :src="item?.user_created?.avatar"
        :alt="item?.user_created?.first_name"
      />
      <span
        v-show="!item?.user_created?.avatar"
        class="text-center font-bold text-xl text-white"
        >{{ item?.user_created?.first_name[0] }}</span
      >
    </div>
    <span>
      <span class="block font-bold">
        {{
          item?.user_created?.first_name + ' ' + item?.user_created?.last_name
        }}</span
      >
      <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
    </span>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tab-body-user-item',
  props: {
    postReactions: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
});
</script>
