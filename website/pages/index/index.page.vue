<template>
  <layout-main>
    <div class="relative">
      <hero-section :isVisible="isFeaturesSectionVisible" />
      <div id="observer">
        <features-section />
      </div>
    </div>
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
import TestimonialSection from '#components/home-page/testimonial-section.vue';
import OurClientsSection from '#components/home-page/our-clients-section.vue';
import NewsLetterSection from '#components/home-page/news-letter-section.vue';
import FeaturesSection from '#components/home-page/features-section.vue';
import ServicesSection from '#components/home-page/services-section.vue';
import KeyFeaturesSection from '#components/home-page/key-features.vue';
import PricingSection from '#components/home-page/pricing-section.vue';
import HeroSection from '#components/home-page/hero-section.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'our-client-section',
  components: {
    FeaturesSection,
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
    const isFeaturesSectionVisible = ref(false);
    onMounted(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            isFeaturesSectionVisible.value = true;
          } else {
            entry.target.classList.remove('visible');
            isFeaturesSectionVisible.value = false;
          }
        });
      });
      const elements = document.querySelectorAll('#observer');
      elements.forEach((element) => {
        observer.observe(element);
      });
    });
    return {
      isFeaturesSectionVisible,
    };
  },
});
</script>

<style scoped>
#observer {
  visibility: hidden;
  opacity: 0;
}
#observer.visible {
  visibility: visible;
  opacity: 1;
}
</style>
