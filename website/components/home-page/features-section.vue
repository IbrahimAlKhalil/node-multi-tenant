<template>
  <div
    class="features-section lg:absolute lg:-bottom-16 w-full"
    data-aos="fade-up"
    data-aos-delay="200"
  >
    <div
      class="lg:bg-white dark:bg-dark lg:rounded-lg lg:shadow-lg lg:w-4/5 lg:gap-0 lg:flex-nowrap md:flex-row md:flex-wrap md:basis-1/2 md:justify-evenly flex flex-col justify-between gap-10 mx-auto py-5"
    >
      <!-- ================== Item Start ===================== -->
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="item px-8 flex flex-col lg:flex-row text-center lg:text-left items-center gap-5 group"
        :class="{
          'border-l md:last:border-l-0 lg:last:border-l border-gray-400':
            index !== 0,
        }"
      >
        <img :src="item.icon" :alt="t(item.title)" width="90px" />
        <div class="text">
          <h3 class="font-bold text-primary dark:text-secondary text-xl mb-2">
            {{ t(item.title) }}
          </h3>
          <p class="text-text dark:text-light">{{ t(item.description) }}</p>
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
        icon: '/resources/images/quran.svg',
        title: "homePage['feature-section']['item-1']['title']",
        description: "homePage['feature-section']['item-1']['description']",
      },
      {
        id: '2',
        icon: '/resources/images/quran.svg',
        title: "homePage['feature-section']['item-2']['title']",
        description: "homePage['feature-section']['item-2']['description']",
      },
      {
        id: '3',
        icon: '/resources/images/quran.svg',
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
