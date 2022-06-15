<template>
  <div
    class="best-services mt-10 py-10 bg-primary-lighter dark:bg-dark text-text dark:text-light border-y-4 border-secondary"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="container mx-auto my-16 flex flex-col md:flex-row justify-between items-center gap-10"
    >
      <div
        class="text-container text-center"
        style="flex: 1 0 30%"
        :class="{
          'md:text-right': index % 2 !== 0,
          'md:text-left': index % 2 === 0,
        }"
      >
        <p class="font-bold text-lg">{{ t(item.subTitle) }}</p>
        <section-title>
          {{ t(item.title) }}
        </section-title>
        <p class="text-sm">
          {{ t(item.description) }}
        </p>
      </div>
      <div
        class="media-container flex"
        :class="{
          '-order-2 md:order-0 justify-start items-start': index % 2 !== 0,
          '-order-2 md:order-2 justify-end items-end': index % 2 === 0,
        }"
        style="flex: 1 0 50%"
        data-aos="fade-up"
        data-aos-delay="100"
        data-aos-duration="1000"
      >
        <img :src="item.image" :alt="item.title" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BestServices2 from '#images/services-section-2.svg?url';
import BestServices from '#images/services-section-1.svg?url';
import SectionTitle from '#components/ui/section-title.vue';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'best-services-section',
  components: {
    SectionTitle,
  },
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
