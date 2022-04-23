<template>
  <layout-main>
    <hero-section />
    <div class="h-screen bg-slate-100"></div>
  </layout-main>
</template>

<script lang="ts">
import HeroSection from '#components/HomePage/HeroSection.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'index-page',
  components: { LayoutMain, HeroSection },
  setup() {
    return {};
  },
});
</script>
