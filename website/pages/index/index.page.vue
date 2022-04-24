<template>
  <layout-main>
    <hero-section />
    <services-section />
    <pricing-section />
  </layout-main>
</template>

<script lang="ts">
import ServicesSection from '#components/HomePage/ServicesSection.vue';
import PricingSection from '#components/HomePage/PricingSection.vue';
import HeroSection from '#components/HomePage/HeroSection.vue';
import LayoutMain from '#layouts/main.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'index-page',
  components: { PricingSection, LayoutMain, HeroSection, ServicesSection },
  setup() {
    return {};
  },
});
</script>
