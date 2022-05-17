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
            @update:category="updateSidebarCategory"
            :tags="tags"
            :active-tag="activeTag"
            @update:tag="updateSidebarTag"
            :sidebarSearch="sidebarSearch"
            @update:search="updateSidebarSearch"
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

// * Actions
/**
 * @param {string} search value
 */
const updateSidebarSearch = (search) => {
  sidebarSearch.value = search;
};

/**
 * @param {string} category slug
 */
const updateSidebarCategory = (category) => {
  activeCategory.value = category;
};

/**
 * @param {string} tag slug
 */
const updateSidebarTag = (tag) => {
  activeTag.value = tag;
};

const categories = ref([
  {
    id: 0,
    name: "blogPage['category-data']['all']",
    slug: 'all',
  },
  {
    id: 1,
    name: "blogPage['category-data']['item-1']",
    slug: 'category-1',
  },
  {
    id: 2,
    name: "blogPage['category-data']['item-2']",
    slug: 'category-2',
  },
  {
    id: 3,
    name: "blogPage['category-data']['item-3']",
    slug: 'category-3',
  },
]);

const tags = ref([
  {
    id: 0,
    name: "blogPage['tag-data']['all']",
    slug: 'all',
  },
  {
    id: 1,
    name: "blogPage['tag-data']['item-1']",
    slug: 'tag-1',
  },
  {
    id: 2,
    name: "blogPage['tag-data']['item-2']",
    slug: 'tag-2',
  },
  {
    id: 3,
    name: "blogPage['tag-data']['item-3']",
    slug: 'tag-3',
  },
]);
</script>
