<template>
  <layout-main :isFooterVisible="false">
    <div
      class="hidden md:block w-[20%] min-h-full bg-gray-200 dark:bg-dark text-text dark:text-light overflow-y-auto rt-scrollbar fixed left-0 pb-20"
      style="
        max-height: calc(100vh - var(--header-height));
        top: var(--header-height);
      "
    >
      <slot name="left-sidebar" />
    </div>
    <div
      class="h-full md:w-[55%] mx-auto text-text dark:text-light"
      style="padding-top: var(--header-height)"
    >
      <slot name="main" />
    </div>
    <div
      class="hidden md:block w-[20%] h-screen bg-blue-50 dark:bg-dark text-text dark:text-light p-2 fixed right-0"
      style="min-width: 250px; top: var(--header-height)"
    >
      <slot name="right-sidebar" />
    </div>
    <div
      v-show="isExpanded"
      class="md:hidden fixed top-0 left-0 w-full min-h-full bg-black/80 text-white text-lg"
      style="
        max-height: calc(100vh - var(--header-height));
        margin-top: var(--header-height);
      "
    >
      <slot name="left-sidebar" />
    </div>
    <div
      class="md:hidden fixed bottom-10 right-3 w-12 h-12 rounded-full transition-all duration-300 ease-out text-xl text-white flex justify-center items-center cursor-pointer"
      :class="{
        'bg-primary hover:bg-primary-dark': !isExpanded,
        'bg-secondary hover:bg-secondary-dark': isExpanded,
      }"
      @click="isExpanded = !isExpanded"
    >
      <component
        :is="Close"
        class="text-3xl"
        style="bottom: 0"
        v-if="isExpanded"
      ></component>
      <component :is="LineHeight" style="bottom: 0" v-else></component>
    </div>
  </layout-main>
</template>
<!-- <template>
  <layout-main>
    <div class="md:h-screen flex" style="margin-top: var(--header-height)">
      <div
        class="hidden md:block w-max h-full bg-gray-200 dark:bg-dark text-text dark:text-light overflow-y-auto rt-scrollbar"
      >
        <slot name="left-sidebar" />
      </div>
      <div
        class="h-full md:max-w-full md:overflow-y-auto pr-5 scrollbar text-text dark:text-light"
        style="flex: 2; scrollbar-width: 0"
      >
        <slot name="main" />
      </div>
      <div
        class="hidden md:block h-full bg-blue-50 dark:bg-dark text-text dark:text-light"
        style="min-width: 250px"
      >
        <slot name="right-sidebar" />
      </div>
    </div>
    <div
      v-show="isExpanded"
      class="md:hidden fixed top-0 left-0 w-full h-full bg-black/80 text-white text-lg"
      style="margin-top: var(--header-height)"
    >
      <slot name="left-sidebar" />
    </div>
    <div
      class="md:hidden fixed bottom-10 right-3 w-12 h-12 rounded-full transition-all duration-300 ease-out text-xl text-white flex justify-center items-center cursor-pointer"
      :class="{
        'bg-primary hover:bg-primary-dark': !isExpanded,
        'bg-secondary hover:bg-secondary-dark': isExpanded,
      }"
      @click="isExpanded = !isExpanded"
    >
      <component
        :is="Close"
        class="text-3xl"
        style="bottom: 0"
        v-if="isExpanded"
      ></component>
      <component :is="LineHeight" style="bottom: 0" v-else></component>
    </div>
  </layout-main>
</template> -->

<script lang="ts">
import LineHeight from '#icons/solid/line-height.svg';
import Close from '#icons/solid/times.svg';
import LayoutMain from '#layouts/main.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    LayoutMain,
  },
  setup() {
    const isExpanded = ref(true);
    return {
      isExpanded,
      LineHeight,
      Close,
    };
  },
});
</script>

<style scoped>
/* Scrollbar Style */
.scrollbar::-webkit-scrollbar {
  width: 0.25rem;
  height: 5px;
}

/* scrollbar-thumb */
.scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

/* scrollbar-track */
.scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}
</style>
