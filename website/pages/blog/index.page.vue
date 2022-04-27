<template>
  <layout-main>
    <hero-section />
    <blog-layout>
      <template #sidebar>
        <div>Sitebar</div>
      </template>
      <template #main>
        <the-blogs />
      </template>
    </blog-layout>
    <news-letter-section />
    <testimonial-section />
  </layout-main>
</template>

<script lang="ts">
import TestimonialSection from '#components/home-page/testimonial-section.vue';
import NewsLetterSection from '#components/home-page/news-letter-section.vue';
import HeroSection from '#components/home-page/hero-section.vue';
import Blogs from '#components/blog-page/blogs.vue';
import BlogLayout from '#layouts/blog-page.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'our-client-section',
  components: {
    BlogLayout,
    'the-blogs': Blogs,
    TestimonialSection,
    NewsLetterSection,
    HeroSection,
    LayoutMain,
  },

  setup() {
    return {};
  },
});
</script>
