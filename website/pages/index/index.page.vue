<template>
  <layout-main>
    <hero-section />
    <services-section />
    <best-services-section />
    <key-features-section />
    <pricing-section />
    <our-clients-section />
    <news-letter-section />
    <testimonial-section />
  </layout-main>
</template>

<script lang="ts">
import BestServicesSection from '#components/home-page/best-services-section.vue';
import OurClientsSection from '#components/home-page/our-clients-section.vue';
import NewsLetterSection from '#components/home-page/news-letter-section.vue';
import ServicesSection from '#components/home-page/services-section.vue';
import KeyFeaturesSection from '#components/home-page/key-features.vue';
import PricingSection from '#components/home-page/pricing-section.vue';
import HeroSection from '#components/home-page/hero-section.vue';
import TestimonialSection from '#components/home-page/testimonial-section.vue';
import LayoutMain from '#layouts/main.vue';

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'our-client-section',
  components: {
    BestServicesSection,
    TestimonialSection,
    KeyFeaturesSection,
    NewsLetterSection,
    OurClientsSection,
    ServicesSection,
    PricingSection,
    HeroSection,
    LayoutMain,
  },
  setup() {
    return {};
  },
});
</script>
