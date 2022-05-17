<template>
  <layout-main>
    <post-hero-section :post="post" />
    <post-intro-section :post="post" />
    <post-page-meta-description-section />
    <post-description-section :post-description="test" />
    <post-tags-section :post="post" />
    <post-share-section />
    <leave-comment-section />

    <post-single-comment />
  </layout-main>
</template>

<script lang="ts">
import PostPageMetaDescriptionSection from '#components/post-page/meta-description.section.vue';
import LeaveCommentSection from '#components/post-page/leave-comment-section.vue';
import PostDescriptionSection from '#components/post-page/desction-section.vue';
import PostSingleComment from '#components/post-page/single-comment.vue';
import PostShareSection from '#components/post-page/share-section.vue';
import PostIntroSection from '#components/post-page/intro-section.vue';
import PostTagsSection from '#components/post-page/tags-section.vue';
import PostHeroSection from '#components/post-page/hero-section.vue';
import { usePageContext } from '#modules/use-page-context';
import { defineComponent, ref, onMounted } from 'vue';
import LayoutMain from '#layouts/main.vue';

export default defineComponent({
  name: 'blog-post',
  components: {
    PostPageMetaDescriptionSection,
    PostDescriptionSection,
    LeaveCommentSection,
    PostSingleComment,
    PostShareSection,
    PostIntroSection,
    PostTagsSection,
    PostHeroSection,
    LayoutMain,
  },

  setup() {
    const { urlPathname } = usePageContext();
    const slug = urlPathname.split('/').pop();
    const post = ref({
      title: 'This is blog post title',
      author: 'This is author',
      date: '2020-01-01',
      slug: 'this-is-blog-post-title',
    });

    const fetchedPost = ref(null);
    const test = ref(
      '' +
        '<p>This is test</p>' +
        '<p>This is test</p>' +
        '<p>This is test</p>',
    );

    onMounted(async () => {
      fetchPost();
    });

    const fetchPost = async () => {
      const response = await fetch(
        `https://cms-digitalocean-x4d4k.ondigitalocean.app/api/products/21?populate=*`,
      );
      const data = await response.json();
      fetchedPost.value = data;
    };

    return {
      fetchedPost,
      post,
      slug,
      test,
    };
  },
});
</script>
