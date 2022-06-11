<template>
  <div>
    <layout-main>
      <blog-hero
        v-model:search="heroSearch"
        :categories="categories"
        :category="heroSearchCategory"
      />
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
import BlogSidebar from '#components/blog-page/blog-sidebar.vue';
import BlogHero from '#components/blog-page/blog-hero.vue';
import Blogs from '#components/blog-page/blogs.vue';
import BlogLayout from '#layouts/blog-page.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BlogPage',
  props: ['posts', 'categories'],
  components: {
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

    const key = ref(
      '?key=system-medium-cover&modified=2022-06-06T07%3A42%3A51.185Z&access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhMzgzMmExLWM4NGYtNDI4Ny1iZTFhLTc2MDkyMDg1MWI4MiIsInJvbGUiOiIyZjQ4MDA0My05NjVhLTRiMjUtOTc5Yi1hMDhkNDgyYmQ2Y2UiLCJhcHBfYWNjZXNzIjp0cnVlLCJhZG1pbl9hY2Nlc3MiOnRydWUsImlhdCI6MTY1NDc1NTA2MSwiZXhwIjoxNjU0NzU1OTYxLCJpc3MiOiJkaXJlY3R1cyJ9.aA7p-jK82iT9TQPMlC-lbKWsdGU-3-LTrv47pVrZazE',
    );

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

    return {
      heroSearch,
      heroSearchCategory,
      activeCategory,
      activeTag,
      sidebarSearch,
      tags,
      key,
    };
  },
});
</script>
