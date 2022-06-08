<template>
  <layout-main>
    <common-scrollable-hero>
      <hero-section />
    </common-scrollable-hero>
  </layout-main>
</template>

<script lang="ts">
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import HeroSection from '#components/contact-page/hero-section.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'contact-page',
  components: {
    CommonScrollableHero,
    'hero-section': HeroSection,
    LayoutMain,
  },
});
</script>
