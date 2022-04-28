<template>
  <div>
    <layout-main>
      <blog-hero
        v-model:search="heroSearch"
        :categories="categories"
        :category="heroSearchCategory"
      />
      <blog-layout>
        <template #sidebar>
          <p>{{ scroll }}</p>
          <blog-sidebar
            :categories="categories"
            :active-category="activeCategory"
            :tags="tags"
            :active-tag="activeTag"
            v-model:search="sidebarSearch"
          />
        </template>
        <template #main>
          <blogs />
        </template>
      </blog-layout>
    </layout-main>
  </div>
</template>

<script setup>
import TestimonialSection from '#components/home-page/testimonial-section.vue';
import NewsLetterSection from '#components/home-page/news-letter-section.vue';
import BlogSidebar from '#components/blog-page/blog-sidebar.vue';
import BlogHero from '#components/blog-page/blog-hero.vue';
import Blogs from '#components/blog-page/blogs.vue';
import BlogLayout from '#layouts/blog-page.vue';
import LayoutMain from '#layouts/main.vue';
import { ref } from 'vue';

const activeCategory = ref('all');
const activeTag = ref('all');
const sidebarSearch = ref('');
const heroSearch = ref('');
const heroSearchCategory = ref('');

const categories = ref([
  {
    id: 0,
    name: 'All',
    slug: 'all',
  },
  {
    id: 1,
    name: 'Category 1',
    slug: 'category-1',
  },
  {
    id: 2,
    name: 'Category 2',
    slug: 'category-2',
  },
  {
    id: 3,
    name: 'Category 3',
    slug: 'category-3',
  },
]);

const tags = ref([
  {
    id: 0,
    name: 'All',
    slug: 'all',
  },
  {
    id: 1,
    name: 'Tag 1',
    slug: 'tag-1',
  },
  {
    id: 2,
    name: 'Tag 2',
    slug: 'tag-2',
  },
  {
    id: 3,
    name: 'Tag 3',
    slug: 'tag-3',
  },
]);
</script>
