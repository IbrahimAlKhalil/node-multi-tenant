<template>
  <div>
    <layout-main>
      <common-scrollable-hero>
        <blog-hero
          v-model:search="heroSearch"
          :categories="categories"
          :category="heroSearchCategory"
          :featuredPosts="featuredPosts"
        />
      </common-scrollable-hero>
      <blog-layout>
        <template #main>
          <blogs>
            <single-blog-card
              v-for="(blog, index) of posts"
              :id="blog.id"
              :key="blog.id"
              :title="blog.title"
              :text="blog.short_content"
              date-label="তারিখ"
              :date="blog.date_created.split('T')[0]"
              :image="'/assets/' + blog.featured_image"
              :link="'/blog/' + blog.slug"
              linkText="Read More"
              :isOdd="index % 2 === 0"
            />
          </blogs>
        </template>
        <template #sidebar>
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
      </blog-layout>
    </layout-main>
  </div>
</template>

<script lang="ts">
import SingleBlogCard from '#components/blog-page/single-blog-card.vue';
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import BlogSidebar from '#components/blog-page/blog-sidebar.vue';
import BlogHero from '#components/blog-page/blog-hero.vue';
import Blogs from '#components/blog-page/blogs.vue';
import BlogLayout from '#layouts/blog-page.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BlogPage',
  props: ['featuredPosts', 'posts', 'categories', 'tags'],
  components: {
    CommonScrollableHero,
    SingleBlogCard,
    BlogSidebar,
    LayoutMain,
    BlogLayout,
    BlogHero,
    Blogs,
  },
  setup() {
    const heroSearch = ref('');
    const heroSearchCategory = ref('');

    const activeCategory = ref('all');
    const activeTag = ref('all');
    const sidebarSearch = ref('');

    const updateSidebarCategory = (category: string) => {
      activeCategory.value = category;
    };
    const updateSidebarTag = (tag: string) => {
      activeTag.value = tag;
    };

    return {
      updateSidebarCategory,
      heroSearchCategory,
      updateSidebarTag,
      activeCategory,
      sidebarSearch,
      heroSearch,
      activeTag,
    };
  },
});
</script>
