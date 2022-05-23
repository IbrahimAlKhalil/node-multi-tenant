<template>
  <layout-main>
    <post-hero-section :post="post" />
    <post-intro-section :post="post" />
    <post-page-meta-description-section />
    <post-description-section :post-description="test" />
    <post-tags-section :post="post" />
    <post-share-section />
    <the-tabs
      :tab-data="tabData"
      :active-tab="activeTab"
      :handle-tab-change="handleTabChange"
    />
    <tab-body v-show="activeTab === 1">
      <comment-section />
    </tab-body>
    <tab-body v-show="activeTab !== 1">
      <div class="p-20"></div>
    </tab-body>
  </layout-main>
</template>

<script lang="ts">
import PostPageMetaDescriptionSection from '#components/post-page/meta-description.section.vue';
import PostDescriptionSection from '#components/post-page/desction-section.vue';
import CommentSection from '#components/post-page/comment-section/index.vue';
import PostShareSection from '#components/post-page/share-section.vue';
import PostIntroSection from '#components/post-page/intro-section.vue';
import PostTagsSection from '#components/post-page/tags-section.vue';
import PostHeroSection from '#components/post-page/hero-section.vue';
import TabBody from '#components/ui/tab-component/tab-body.vue';
import TheTabs from '#components/ui/tab-component/tabs.vue';
import { usePageContext } from '#modules/use-page-context';
import ThumbsDown from '#icons/regular/thumbs-down.svg';
import CommentIcon from '#icons/regular/comments.svg';
import ThumbsUp from '#icons/regular/thumbs-up.svg';
import AngryIcon from '#icons/regular/angry.svg';
import SadIcon from '#icons/regular/sad-cry.svg';
import { comment } from '#types/comment-type';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'blog-post',
  components: {
    PostPageMetaDescriptionSection,
    PostDescriptionSection,
    PostShareSection,
    PostIntroSection,
    PostTagsSection,
    PostHeroSection,
    CommentSection,
    LayoutMain,
    TheTabs,
    TabBody,
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
      tabData: [
        { id: 1, title: 'Comments', icon: CommentIcon, count: 10 },
        { id: 2, title: 'Like', icon: ThumbsUp, count: 10 },
        { id: 3, title: 'Dislike', icon: ThumbsDown, count: 10 },
        { id: 4, title: 'Sad', icon: SadIcon, count: 50 },
        { id: 5, title: 'Angry', icon: AngryIcon, count: 10 },
      ],
      activeTab: 1,
    };
  },
  methods: {
    handleTabChange(id: number) {
      this.activeTab = id;
    },
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
