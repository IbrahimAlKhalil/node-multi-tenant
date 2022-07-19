<template>
  <layout-main>
    <div class="relative">
      <hero-section :isVisible="isFeaturesSectionVisible" />
      <features-section id="observer" />
    </div>

    <section id="features" class="hash-section">
      <services-section />
      <best-services-section />
      <key-features-section />
    </section>
    <pricing-section class="hash-section" />
    <about-us-section class="hash-section" />
    <our-clients-section />
    <testimonial-section />
    <news-letter-section />
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
import AboutUsSection from '#components/home-page/about-us-section.vue';
import PricingSection from '#components/home-page/pricing-section.vue';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import HeroSection from '#components/home-page/hero-section.vue';
import { useNavData } from '#stores/navdata.store';
import LayoutMain from '#layouts/main.vue';

export default defineComponent({
  name: 'our-client-section',
  components: {
    'about-us-section': AboutUsSection,
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

  setup: function () {
    const navData = useNavData();

    const isFeaturesSectionVisible = ref(false);

    let featureSectionElement: HTMLAnchorElement | null = null;
    let observer: IntersectionObserver | null = null;

    onMounted(() => {
      featureSectionElement = document.querySelector('#observer');

      observer = new IntersectionObserver((entries) => {
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

      if (featureSectionElement && observer) {
        observer.observe(featureSectionElement);
      }
    });
    onUnmounted(() => {
      if (featureSectionElement && observer) {
        observer.unobserve(featureSectionElement);
      }
    });
    return {
      isFeaturesSectionVisible,
      navData,
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
