<template>
  <li class="cursor-pointer ml-3 mb-1">
    <router-link
      :to="'/tutorials/' + data.slug"
      class="block w-full"
      v-slot="{ isExactActive }"
    >
      <span
        class="flex items-center gap-3 w-full py-1 px-2 rounded-l hover:bg-primary hover:text-white transition"
        :class="[
          isFolder ? 'font-bold' : '',
          isExactActive ? 'bg-primary text-white' : '',
        ]"
      >
        <span @click="toggle">
          <AngleDown v-show="isFolder && isOpen" />
          <AngleUp v-show="isFolder && !isOpen" />
        </span>
        {{ data.title }}
      </span>
    </router-link>

    <the-list v-show="isOpen" v-if="isFolder">
      <list-item
        v-for="item of data.children"
        :currentSlug="currentSlug"
        :key="item.slug"
        :data="item"
      ></list-item>
    </the-list>
  </li>
</template>

<script lang="ts">
import AngleDown from '#icons/solid/angle-down.svg';
import AngleUp from '#icons/solid/angle-up.svg';
import { TheList } from '#components/ui/list';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'list-item',

  components: {
    AngleDown,
    AngleUp,
    TheList,
  },

  props: {
    spacing: {
      type: String,
      default: 'px-5 py-1',
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    currentSlug: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isOpen: true,
    };
  },

  computed: {
    isFolder() {
      return this.data.children && this.data.children.length;
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      }
    },
  },
  setup() {
    return {};
  },
});
</script>
