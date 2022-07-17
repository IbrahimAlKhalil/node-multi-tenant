<template>
  <div>
    <layout-main>
      <common-scrollable-hero>
        <blog-hero :featuredPosts="featuredPosts" />
      </common-scrollable-hero>
      <div class="my-5"></div>
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
            <the-pagination
              v-show="totalPage > 1"
              @change-page="handleChangePage"
              :total="totalPage"
              :activePage="activePage"
            />
          </blogs>
        </template>
        <template #sidebar>
          <blog-sidebar
            :categories="categories"
            v-model:active-category="activeCategory"
            :tags="tags"
            v-model:active-tag="activeTag"
            v-model:search="sidebarSearch"
            :searchText="searchText"
          />
        </template>
      </blog-layout>
    </layout-main>
  </div>
</template>

<script lang="ts">
import { Pagination as ThePagination } from '#components/ui/pagination';
import SingleBlogCard from '#components/blog-page/single-blog-card.vue';
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import BlogSidebar from '#components/blog-page/blog-sidebar.vue';
import BlogHero from '#components/blog-page/blog-hero.vue';
import { usePageContext } from '#modules/use-page-context';
import Blogs from '#components/blog-page/blogs.vue';
import BlogLayout from '#layouts/blog-page.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BlogPage',
  props: ['blogsAggregate', 'searchText'],
  components: {
    CommonScrollableHero,
    SingleBlogCard,
    ThePagination,
    BlogSidebar,
    LayoutMain,
    BlogLayout,
    BlogHero,
    Blogs,
  },
  data() {
    return {
      totalPage: Math.ceil(Number(this.blogsAggregate[0].count) / 5),
      isSearching: false,
      activePage: !isNaN(Number(this.page)) ? Number(this.page) : 1,
      sidebarSearch: '',
      activeCategory: '',
      activeTag: '',
    };
  },
  mounted() {
    this.isSearching = !!this.searchText;
  },
  methods: {
    handleChangePage(page: number) {
      this.activePage = page;
      this.handleQuery('page', String(page));
    },
    handleQuery(key: string, val: string) {
      const uri = window.location.href
        .replace(
          RegExp('([?&]' + key + '(?=[=&#]|$)[^#&]*|(?=#|$))'),
          '&' + key + '=' + encodeURIComponent(val),
        )
        .replace(/^([^?&]+)&/, '$1?');
      console.log({
        url: uri,
        key,
        val,
      });
      window.location.href = uri;
    },
  },
  setup() {
    const ctx = usePageContext();

    return ctx.pageProps;
  },
});
</script>
