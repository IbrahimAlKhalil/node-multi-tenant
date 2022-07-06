<template>
  <layout-main>
    <common-scrollable-hero>
      <HeroSection />
    </common-scrollable-hero>
  </layout-main>
</template>

<script lang="ts" setup>
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import HeroSection from '#components/login-page/hero-section.vue';
import LayoutMain from '#layouts/main.vue';
</script>
