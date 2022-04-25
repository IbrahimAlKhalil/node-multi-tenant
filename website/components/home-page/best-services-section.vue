<template>
  <div
    class="best-services mt-10 py-10 bg-primary-lighter border-y-4 border-secondary"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="container mx-auto my-16 flex justify-between items-center gap-10"
    >
      <div
        class="text-container"
        style="flex: 1 0 30%"
        :class="{ 'text-right': index % 2 !== 0, 'text-left': index % 2 === 0 }"
      >
        <p class="font-bold text-lg text-text">{{ t(item.subTitle) }}</p>
        <h3 class="font-bold text-5xl text-primary my-5">
          {{ t(item.title) }}
        </h3>
        <p class="text-text text-sm">
          {{ t(item.description) }}
        </p>
      </div>
      <div
        class="media-container flex"
        :class="{
          '-order-1 justify-start items-start': index % 2 !== 0,
          'order-0 justify-end items-end': index % 2 === 0,
        }"
        style="flex: 1 0 50%"
      >
        <img :src="item.image" :alt="item.title" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BestServices2 from '#images/services-section-2.svg?url';
import BestServices from '#images/services-section-1.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'best-services-section',
  setup() {
    const i18n = useI18n();
    const items = [
      {
        id: 1,
        subTitle:
          "homePage['best-services-section']['items']['item-1']['sub-title']",
        title: "homePage['best-services-section']['items']['item-1']['title']",
        description:
          "homePage['best-services-section']['items']['item-1']['description']",
        image: BestServices,
      },
      {
        id: 2,
        subTitle:
          "homePage['best-services-section']['items']['item-2']['sub-title']",
        title: "homePage['best-services-section']['items']['item-2']['title']",
        description:
          "homePage['best-services-section']['items']['item-2']['description']",
        image: BestServices2,
      },
    ];
    return {
      items,
      t: i18n.t,
    };
  },
});
</script>

<style scoped></style>
