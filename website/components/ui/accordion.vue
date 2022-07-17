<template>
  <div>
    <div
      class="bg-gray-50 dark:bg-dark font-bold border border-gray-200 dark:border-black rounded-t-md py-2 pl-8 my-3 flex justify-between items-center overflow-hidden relative before:w-5 before:h-full before:bg-secondary before:absolute before:left-0 before:top-0 cursor-pointer text-text dark:text-light"
      :class="{ 'rounded-b-md': !isOpen }"
      @click="isOpen = !isOpen"
    >
      <p>{{ title }}</p>
      <span class="text-4xl px-3 text-secondary">
        <AngleDown v-show="!isOpen" style="bottom: 0" />
        <AngleUp v-show="isOpen" style="bottom: 0" />
      </span>
    </div>

    <div
      v-show="isOpen"
      :class="{ 'rounded-b-md': isOpen }"
      class="bg-gray-50 dark:bg-dark relative before:w-5 before:h-full before:bg-gray-200 dark:before:bg-black dark:border-black before:absolute before:left-0 before:top-0 p-5 pl-8 overflow-hidden text-text dark:text-light"
    >
      <p>
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import AngleDown from '#icons/solid/angle-down.svg';
import AngleUp from '#icons/solid/angle-up.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-accordion',
  components: {
    AngleDown,
    AngleUp,
  },
  data() {
    return {
      isOpen: false,
    };
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },

  setup() {
    return {};
  },
});
</script>
