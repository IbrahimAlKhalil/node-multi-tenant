<template>
  <layout-main>
    <post-hero-section :post="post" />
    <post-intro-section :post="post" />
    <post-page-meta-description-section />
    <post-description-section :post-description="test" />
    <post-tags-section :post="post" />
    <post-share-section />
    <the-tab />
    <leave-comment-section />
    <comments-layout :comments="commentsData" />
  </layout-main>
</template>

<script lang="ts">
import PostPageMetaDescriptionSection from '#components/post-page/meta-description.section.vue';
import LeaveCommentSection from '#components/post-page/leave-comment-section.vue';
import PostDescriptionSection from '#components/post-page/desction-section.vue';
import PostShareSection from '#components/post-page/share-section.vue';
import PostIntroSection from '#components/post-page/intro-section.vue';
import PostTagsSection from '#components/post-page/tags-section.vue';
import PostHeroSection from '#components/post-page/hero-section.vue';
import TheTab from '#components/ui/tab-component/tab.vue'
import { usePageContext } from '#modules/use-page-context';
import { defineComponent } from 'vue';
import LayoutMain from '#layouts/main.vue';
import CommentsLayout from '#layouts/comments-layout.vue';
import { comment } from '#types/comment-type';

export default defineComponent({
  name: 'blog-post',
  components: {
    CommentsLayout,
    PostPageMetaDescriptionSection,
    PostDescriptionSection,
    LeaveCommentSection,
    PostShareSection,
    PostIntroSection,
    PostTagsSection,
    PostHeroSection,
    LayoutMain,
    TheTab,
  },

  data() {
    return {
      post: {
        title: 'This is blog post title',
        author: 'This is author',
        date: '2020-01-01',
        slug: 'this-is-blog-post-title',
      },
      commentsData: [] as comment[],
      test:
        '<div>' +
        '<h3>This is test html data rendering</h3>' +
        '<p>This is test html data rendering</p>' +
        '</div>',
    };
  },

  setup() {
    const { urlPathname } = usePageContext();
    const slug = urlPathname.split('/').pop();

    return {
      slug,
    };
  },
});
</script>
