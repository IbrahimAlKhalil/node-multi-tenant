<template>
  <div class="border-b dark:border-b-black">
    <ul class="container flex items-center justify-center gap-5">
      <the-tab
        v-for="tab in tabData"
        :key="tab.id"
        :id="tab.id"
        :title="tab.title"
        :icon="tab.icon"
        :count="tab.count"
        :isActive="tab.id === activeTab"
        @handle-change="handleTabChange"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import TheTab from '#components/ui/tab-component/tab.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-tabs',
  props: {
    tabData: {
      type: Array,
      required: true,
    },
    activeTab: {
      type: Number,
      required: true,
    },
    handleTabChange: {
      type: Function,
    },
  },
  components: {
    TheTab,
  },
  setup() {
    return;
  },
});
</script>
