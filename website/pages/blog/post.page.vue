<template>
  <layout-main>
    <post-hero-section :post="post" />
    <post-intro-section :post="post" />
    <post-page-meta-description-section />
    <post-description-section :post-description="test" />
    <post-reactions-section @handle-click="handleReaction" />
    <div class="py-5 bg-gray-100 dark:bg-dark my-10">
      <post-tags-section :post="post" />
      <post-share-section />
    </div>
    <the-tabs>
      <the-tab
        @handle-change="handleTabChange"
        :active-tab="activeTab"
        v-for="tab in tabData"
        :key="tab.id"
        :id="tab.id"
        :title="tab.title"
        :count="tab.count"
        :isActive="tab.title.toLowerCase() === activeTab"
      >
        <div class="w-8 h-8 flex justify-center items-center overflow-hidden">
          <span>
            <component
              class="text-xl"
              :is="CommentIcon"
              v-if="tab.title === 'Comments'"
            ></component>
            <EmojiLike
              v-if="tab.title === 'Like'"
              class="scale-[18%] transition duration-300 cursor-pointer"
              :class="[
                tab.title.toLowerCase() !== activeTab
                  ? 'grayscale'
                  : 'grayscale-0',
              ]"
            />
            <EmojiWow
              v-if="tab.title === 'Wow'"
              class="scale-[18%] transition duration-300 cursor-pointer"
              :class="[
                tab.title.toLowerCase() !== activeTab
                  ? 'grayscale'
                  : 'grayscale-0',
              ]"
            />
            <EmojiSad
              v-if="tab.title === 'Sad'"
              class="scale-[18%] transition duration-300 cursor-pointer"
              :class="[
                tab.title.toLowerCase() !== activeTab
                  ? 'grayscale'
                  : 'grayscale-0',
              ]"
            />
            <EmojiAngry
              v-if="tab.title === 'Angry'"
              class="scale-[18%] transition duration-300 cursor-pointer"
              :class="[
                tab.title.toLowerCase() !== activeTab
                  ? 'grayscale'
                  : 'grayscale-0',
              ]"
            />
          </span>
        </div>
      </the-tab>
    </the-tabs>
    <tab-body v-show="activeTab === 'comments'">
      <comment-section />
    </tab-body>
    <tab-body v-show="activeTab === 'like'">
      <tab-body-users-container>
        <li
          v-for="item of 20"
          :key="item"
          class="flex items-center gap-2 text-text text-lg"
        >
          <div class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden">
            <img :src="'https://i.pravatar.cc/40?img=' + item" :alt="item" />
          </div>
          <span>
            <span class="block font-bold">User Name {{ item }}</span>
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'wow'">
      <tab-body-users-container
        ><span class="text-center"> No users found</span>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'sad'">
      <tab-body-users-container>
        <li
          v-for="item of 15"
          :key="item"
          class="flex items-center gap-2 text-text text-lg"
        >
          <div class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden">
            <img
              :src="'https://i.pravatar.cc/40?img=' + item * 2"
              :alt="item"
            />
          </div>
          <span>
            <span class="block font-bold">User Name {{ item }}</span>
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'angry'">
      <tab-body-users-container>
        <li
          v-for="item of 10"
          :key="item"
          class="flex items-center gap-2 text-text text-lg"
        >
          <div class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden">
            <img
              :src="'https://i.pravatar.cc/40?img=' + item * 3"
              :alt="item"
            />
          </div>
          <span>
            <span class="block font-bold">User Name {{ item }}</span>
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
  </layout-main>
</template>

<script lang="ts">
import PostPageMetaDescriptionSection from '#components/post-page/meta-description.section.vue';
import PostDescriptionSection from '#components/post-page/description-section.vue';
import PostReactionsSection from '#components/post-page/reactions-section.vue';
import CommentSection from '#components/post-page/comment-section/index.vue';
import TabBodyUsersContainer from '#components/blog-page/tab-body-users.vue';
import PostShareSection from '#components/post-page/share-section.vue';
import PostIntroSection from '#components/post-page/intro-section.vue';
import PostTagsSection from '#components/post-page/tags-section.vue';
import PostHeroSection from '#components/post-page/hero-section.vue';
import TabBody from '#components/ui/tab-component/tab-body.vue';
import TheTabs from '#components/ui/tab-component/tabs.vue';
import { usePageContext } from '#modules/use-page-context';
import TheTab from '#components/ui/tab-component/tab.vue';
import CommentIcon from '#icons/regular/comments.svg';
import { comment } from '#types/comment-type';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
} from '#components/animated-reactions';

export default defineComponent({
  name: 'blog-post',
  components: {
    PostPageMetaDescriptionSection,
    PostDescriptionSection,
    TabBodyUsersContainer,
    PostReactionsSection,
    PostShareSection,
    PostIntroSection,
    PostTagsSection,
    PostHeroSection,
    CommentSection,
    EmojiAngry,
    LayoutMain,
    EmojiLike,
    EmojiSad,
    EmojiWow,
    TheTabs,
    TabBody,
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
      tabData: [
        {
          id: 1,
          title: 'Comments',
          count: 10,
        },
        { id: 2, title: 'Like', count: 10 },
        { id: 3, title: 'Wow', count: 10 },
        { id: 4, title: 'Sad', count: 50 },
        { id: 5, title: 'Angry', count: 10 },
      ],
      activeTab: 'comments',
    };
  },
  methods: {
    handleTabChange(title: string) {
      this.activeTab = title.toLocaleLowerCase();
    },
    handleReaction(name: string) {
      this.tabData.forEach((item) => {
        if (item.title.toLowerCase() === name.toLowerCase()) {
          item.count += 1;
        }
      });
    },
  },

  setup() {
    const { urlPathname } = usePageContext();
    const slug = urlPathname.split('/').pop();

    return {
      CommentIcon,
      slug,
    };
  },
});
</script>
