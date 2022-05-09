<template>
  <div
    class="controller container flex items-center justify-center gap-2 text-2xl text-primary md:hidden cursor-pointer p-3"
    @click="toggleFilter"
  >
    <component :is="FilterIcon"></component>
    <span class="font-bold">Filter</span>
  </div>
  <div class="container flex gap-5 mb-10 relative">
    <main class="main-area" style="flex: 2 1 75%">
      <slot name="main" />
    </main>
    <aside class="sidebar hidden md:block" style="flex: 1 0 25%">
      <slot name="sidebar" />
    </aside>
    <div
      :class="{ hidden: !filterDrawer }"
      class="h-full bg-[rgba(0,0,0,0.75)] w-full absolute top-0 right-0"
      @click="toggleFilter"
    >
      <div class="w-1/2 h-full absolute top-0 right-0" @click.stop>
        <slot name="sidebar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const filterDrawer = ref(false);

const toggleFilter = () => {
  filterDrawer.value = !filterDrawer.value;
};

import FilterIcon from '#icons/solid/filter.svg';
</script>
