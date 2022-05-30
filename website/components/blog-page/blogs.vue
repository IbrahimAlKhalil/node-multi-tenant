<template>
  <div class="blog-area">
    <div class="flex flex-col gap-10">
      <single-blog-card
        v-for="(blog, index) of blogsList"
        :key="blog.id"
        :title="blog.title"
        :text="blog.description"
        :date-label="blog.dateLabel"
        :date="blog.date"
        :image="blog.image"
        :id="blog.id"
        :link="blog.link"
        :linkText="blog.linkText"
        :isOdd="index % 2 === 0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SingleBlogCard from '#components/blog-page/single-blog-card.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'the-blogs',
  components: { SingleBlogCard },
  setup: function () {
    const i18n = useI18n();
    const blogsList = [
      {
        id: 1,
        title: 'blogs.blog1.title',
        description: 'blogs.blog1.description',
        image:
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        dateLabel: "blogs['date-label']",
        date: 'blogs.blog1.date',
        link: '/blog/blog-1',
        linkText: 'blogs.blog1.linkText',
      },
      {
        id: 2,
        title: 'blogs.blog2.title',
        description: 'blogs.blog2.description',
        image:
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        dateLabel: "blogs['date-label']",
        date: 'blogs.blog2.date',
        link: '/blog/blog-2',
        linkText: 'blogs.blog2.linkText',
      },
      {
        id: 3,
        title: 'blogs.blog3.title',
        description: 'blogs.blog3.description',
        image:
          'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        dateLabel: "blogs['date-label']",
        date: 'blogs.blog3.date',
        link: '/blog/blog-3',
        linkText: 'blogs.blog3.linkText',
      },
    ];
    return {
      t: i18n.t,
      blogsList,
    };
  },
});
</script>
