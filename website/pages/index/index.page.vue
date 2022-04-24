<template>
  <layout-main>
    <hero-section />
    <services-section />
    <div class="h-screen bg-slate-100"></div>
    <main-footer />
  </layout-main>
</template>

<script lang="ts">
import ServicesSection from '#components/HomePage/ServicesSection.vue';
import HeroSection from '#components/HomePage/HeroSection.vue';
import MainFooter from '#components/Footer/MainFooter.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'index-page',
  components: { LayoutMain, HeroSection, ServicesSection, MainFooter },
  setup() {
    return {};
  },
});
</script>
