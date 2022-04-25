<template>
  <div class="features-section absolute -bottom-16 w-full">
    <div
      class="bg-white rounded-lg shadow-lg w-4/5 mx-auto flex justify-between py-5"
    >
      <!-- ================== Item Start ===================== -->
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="item px-8 flex items-center gap-5 group"
        :class="{ 'border-l border-gray-400': index !== 0 }"
      >
        <img
          :src="item.icon"
          :alt="t(item.title)"
          width="90px"
          class="transition duration-500 group-hover:scale-125"
        />
        <div class="text">
          <h3 class="font-bold text-primary text-xl mb-2">
            {{ t(item.title) }}
          </h3>
          <p class="text-text">{{ t(item.description) }}</p>
        </div>
      </div>
      <!-- Item End -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'features-section',
  setup() {
    const i18n = useI18n();
    const items = [
      {
        id: '1',
        icon: '/assets/images/quran.svg',
        title: "homePage['feature-section']['item-1']['title']",
        description: "homePage['feature-section']['item-1']['description']",
      },
      {
        id: '2',
        icon: '/assets/images/quran.svg',
        title: "homePage['feature-section']['item-2']['title']",
        description: "homePage['feature-section']['item-2']['description']",
      },
      {
        id: '3',
        icon: '/assets/images/quran.svg',
        title: "homePage['feature-section']['item-3']['title']",
        description: "homePage['feature-section']['item-3']['description']",
      },
    ];
    return {
      t: i18n.t,
      items,
    };
  },
});
</script>
