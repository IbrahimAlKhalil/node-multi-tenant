<template>
  <layout-main>
    <hero-section />
    <services-section />
    <best-services-section />
    <pricing-section />
  </layout-main>
</template>

<script lang="ts">
import BestServicesSection from '#components/home-page/best-services-section.vue';
import ServicesSection from '#components/home-page/services-section.vue';
import PricingSection from '#components/home-page/pricing-section.vue';
import HeroSection from '#components/home-page/hero-section.vue';
import LayoutMain from '#layouts/main.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'index-page',
  components: {
    BestServicesSection,
    PricingSection,
    LayoutMain,
    HeroSection,
    ServicesSection,
  },
  setup() {
    return {};
  },
});
</script>
