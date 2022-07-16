<template>
  <li class="cursor-pointer text-lg px-3 py-1">
    <span
      class="hover:text-primary flex items-center gap-2 w-full"
      :class="{ 'text-primary font-bold': isChecked }"
      @click="isCollapsed = !isCollapsed"
    >
      <span v-show="isFolder" class="text-sm">[<b class="text-md">-</b>] </span>
      <span v-show="!isFolder">&ensp;&ensp;&ensp;</span>
      <span> {{ item.title }}</span>
      <span>
        <TickIcon style="bottom: 0" v-show="isChecked" />
      </span>
    </span>

    <ul class="w-full">
      <list-item
        v-for="subCategory of item.subCategories"
        :key="subCategory.id"
        :item="subCategory"
        :postCategory="postCategory"
      />
    </ul>
  </li>
</template>
<script lang="ts">
import TickIcon from '#icons/solid/check.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'list-item',
  components: { TickIcon },
  data() {
    return {
      isCollapsed: true,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    postCategory: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isChecked() {
      return this.postCategory.id == this.item.id;
    },
    isFolder() {
      return this.item.subCategories && this.item.subCategories.length;
    },
  },
  setup() {
    return {};
  },
});
</script>
