<template>
  <layout-main>
    <post-hero-section
      :image="post.featured_image"
      :categoryName="primaryCategory.name"
      :title="post.title"
    />
    <post-intro-section
      :author="post.user_created"
      :date="post.date_created.split('T')[0]"
      :title="post.title"
      :slug="post.slug"
      :categoryName="primaryCategory.name"
      :categorySlug="primaryCategory.slug"
    />
    <post-page-meta-description-section :short_content="post.short_content" />

    <post-description-section :content="post.content" />

    <post-reactions-section
      :reactions="reactions"
      :handleClickReaction="handleClickReaction"
    />
    <div class="py-5 bg-gray-100 dark:bg-dark my-10">
      <post-tags-section :tags="post.tags" />
      <post-share-section
        :title="post.title"
        :shortDetails="post.short_content.slice(0, 50)"
      />
    </div>
    <the-tabs>
      <the-tab
        @handle-change="handleTabChange"
        title="comments"
        :count="10"
        :isActive="'comments' === activeTab"
      >
        <CommentIcon class="text-xl" />
      </the-tab>

      <the-tab
        @handle-change="handleTabChange"
        :active-tab="activeTab"
        v-for="(count, name) in countReaction"
        :key="name"
        :id="name"
        :title="name"
        :count="count"
        :isActive="name.toLowerCase() === activeTab"
      >
        <tab-button
          :title="name"
          :activeTab="activeTab"
          :reactionsCount="count"
        />
      </the-tab>
    </the-tabs>
    <tab-body v-show="activeTab === 'comments'">
      <comment-section
        :data="comments"
        :commentValue="commentValue"
        :suggestions="suggestions"
        :submitComment="submitComment"
        :reactions="reactions"
        :commentsReactions="commentsReactions"
        :updateComment="updateComment"
        :selectSuggestion="selectSuggestion"
        :groupComments="groupComments"
      />
    </tab-body>
    <tab-body v-show="activeTab === 'like'">
      <tab-body-users-container>
        <li
          v-for="item of postReactions.filter(
            (react) => react.reaction.value === 'like',
          )"
          :key="item.id"
          class="flex items-center gap-2 text-text dark:text-light text-lg"
        >
          <div
            class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex justify-center items-center"
          >
            <img
              v-show="item?.user_created?.avatar"
              :src="item?.user_created?.avatar"
              :alt="item?.user_created?.first_name"
            />
            <span
              v-show="!item?.user_created?.avatar"
              class="text-center font-bold text-xl text-white"
              >{{ item?.user_created?.first_name[0] }}</span
            >
          </div>
          <span>
            <span class="block font-bold">
              {{
                item?.user_created?.first_name +
                ' ' +
                item?.user_created?.last_name
              }}</span
            >
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'wow'">
      <tab-body-users-container>
        <li
          v-for="item of postReactions.filter(
            (react) => react.reaction.value === 'like',
          )"
          :key="item.id"
          class="flex items-center gap-2 text-text dark:text-light text-lg"
        >
          <div
            class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex justify-center items-center"
          >
            <img
              v-show="item?.user_created?.avatar"
              :src="item?.user_created?.avatar"
              :alt="item?.user_created?.first_name"
            />
            <span
              v-show="!item?.user_created?.avatar"
              class="text-center font-bold text-xl text-white"
              >{{ item?.user_created?.first_name[0] }}</span
            >
          </div>
          <span>
            <span class="block font-bold">
              {{
                item?.user_created?.first_name +
                ' ' +
                item?.user_created?.last_name
              }}</span
            >
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'sad'">
      <tab-body-users-container>
        <li
          v-for="item of postReactions.filter(
            (react) => react.reaction.value === 'like',
          )"
          :key="item.id"
          class="flex items-center gap-2 text-text dark:text-light text-lg"
        >
          <div
            class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex justify-center items-center"
          >
            <img
              v-show="item?.user_created?.avatar"
              :src="item?.user_created?.avatar"
              :alt="item?.user_created?.first_name"
            />
            <span
              v-show="!item?.user_created?.avatar"
              class="text-center font-bold text-xl text-white"
              >{{ item?.user_created?.first_name[0] }}</span
            >
          </div>
          <span>
            <span class="block font-bold">
              {{
                item?.user_created?.first_name +
                ' ' +
                item?.user_created?.last_name
              }}</span
            >
            <span class="block text-sm text-gray-500">Lorem, ipsum dolor.</span>
          </span>
        </li>
      </tab-body-users-container>
    </tab-body>
    <tab-body v-show="activeTab === 'angry'">
      <tab-body-users-container>
        <li
          v-for="item of postReactions.filter(
            (react) => react.reaction.value === 'like',
          )"
          :key="item.id"
          class="flex items-center gap-2 text-text dark:text-light text-lg"
        >
          <div
            class="w-10 h-10 rounded-full bg-slate-400 overflow-hidden flex justify-center items-center"
          >
            <img
              v-show="item?.user_created?.avatar"
              :src="item?.user_created?.avatar"
              :alt="item?.user_created?.first_name"
            />
            <span
              v-show="!item?.user_created?.avatar"
              class="text-center font-bold text-xl text-white"
              >{{ item?.user_created?.first_name[0] }}</span
            >
          </div>
          <span>
            <span class="block font-bold">
              {{
                item?.user_created?.first_name +
                ' ' +
                item?.user_created?.last_name
              }}</span
            >
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
import { defineComponent, reactive, ref, inject, computed } from 'vue';
import { ReactionType, PostReactionType } from '#types/reaction-type';
import PostTagsSection from '#components/post-page/tags-section.vue';
import PostHeroSection from '#components/post-page/hero-section.vue';
import TabBody from '#components/ui/tab-component/tab-body.vue';
import TabButton from '#components/post-page/tab-button.vue';
import { comment as CommentType } from '#types/comment-type';
import TheTabs from '#components/ui/tab-component/tabs.vue';
import { usePageContext } from '#modules/use-page-context';
import TheTab from '#components/ui/tab-component/tab.vue';
import CommentIcon from '#icons/regular/comments.svg';
import { useAuth } from '#stores/auth.store';
import LayoutMain from '#layouts/main.vue';
import _ from 'lodash';
import { useRoute } from 'vue-router';

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
    CommentIcon,
    LayoutMain,
    TabButton,
    TheTabs,
    TabBody,
    TheTab,
  },
  data() {
    return {
      activeTab: 'comments',
    };
  },
  props: ['post', 'commentsReactions'],
  computed: {
    primaryCategory() {
      const primaryCategory = this.post.primary_category
        ? this.post.primary_category.name
        : this.post.categories[0].post_category_id.name;

      const primaryCategorySlug = this.post.primary_category
        ? this.post.primary_category.slug
        : this.post.categories[0].post_category_id.slug;

      return {
        name: primaryCategory,
        slug: primaryCategorySlug,
      };
    },
  },
  methods: {
    handleTabChange(title: string) {
      this.activeTab = title.toLocaleLowerCase();
    },
  },

  setup() {
    // Toast
    const toast: any = inject('$toast');
    // Context
    const { urlPathname, pageProps } = usePageContext();
    const auth = useAuth();
    const slug = urlPathname.split('/').pop();
    const router = useRoute();
    // Type
    type ReactionCountType = {
      Like: number;
      Wow: number;
      Sad: number;
      Angry: number;
    };
    // States
    const commentValue = ref('');

    const commentsData = reactive<{
      comments: CommentType[];
    }>({
      comments: [],
    });

    const groupComments = computed(() =>
      _.groupBy(commentsData.comments, 'institute.code'),
    );

    commentsData.comments =
      (pageProps?.comments as CommentType[]) ?? ([] as CommentType[]);
    const postReactionsData = reactive<{
      postReactions: PostReactionType[];
      countReaction: ReactionCountType;
    }>({
      postReactions: [],
      countReaction: {} as ReactionCountType,
    });
    postReactionsData.postReactions = pageProps?.postReactions
      ? [...(pageProps.postReactions as PostReactionType[])]
      : [];

    const countReactions = (postReactions: PostReactionType[]) => {
      const array = postReactions ?? ([] as PostReactionType[]);
      postReactionsData.countReaction = array.reduce(
        (acc: ReactionCountType, reaction: PostReactionType) => {
          if (reaction.reaction.value === 'like') {
            acc.Like++;
          } else if (reaction.reaction.value === 'wow') {
            acc.Wow++;
          } else if (reaction.reaction.value === 'sad') {
            acc.Sad++;
          } else if (reaction.reaction.value === 'angry') {
            acc.Angry++;
          }
          return acc;
        },
        { Like: 0, Wow: 0, Sad: 0, Angry: 0 },
      );
    };

    countReactions(postReactionsData.postReactions);

    const selectSuggestion = (value: string) => {
      console.log('Select Suggestion called: ', value);
      commentValue.value = commentValue.value + ' ' + value;
    };
    /**
     * Update Comment
     * @param value : string
     */
    const updateComment = (value: string) => {
      commentValue.value = value;
    };
    /**
     * Submit Comment
     * @param { mention: number | null; parent: number | null;}
     */
    const submitComment = async (
      extraData: {
        mention: number | null;
        parent: number | null;
      } = {
        mention: null,
        parent: null,
      },
    ) => {
      const cluster = localStorage.getItem('cluster');
      if (!auth.user || !cluster) {
        location.replace('/login');
        return;
      }
      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({
          mention: extraData.mention,
          parent: extraData.parent,
          post: pageProps?.postId,
          content: commentValue.value,
          cluster,
        }),
        headers: {
          'X-Csrf-Token':
            sessionStorage.getItem('csrfToken') ??
            localStorage.getItem('csrfToken') ??
            '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const result = await response.json();
      if (result?.message) {
        toast.success('Your comment added!', {
          dismissible: true,
          duration: 1000 * 5,
        });

        commentsData.comments.push({
          id: 21,
          status: 'published',
          content: commentValue.value,
          date_created: new Date().toISOString(),
          user: Number(auth.user.id),
          post: Number(pageProps?.postId) ?? 0,
          parent: extraData.parent,
          mention: extraData.mention,
          institute: {
            cluster: {
              host: cluster,
            },
          },
        });

        commentValue.value = '';
        location.reload();
      } else {
        toast.error('Something went wrong!', {
          dismissible: true,
          duration: 1000 * 5,
        });
      }
    };
    /**
     * Handle Reaction
     * @param reactionId
     */
    const handleClickReaction = async (reactionId: number) => {
      const cluster = localStorage.getItem('cluster');
      if (!auth.user || !cluster) {
        location.replace('/login');
      }
      const res = await fetch('/api/reaction', {
        method: 'POST',
        body: JSON.stringify({
          reaction: reactionId,
          post: pageProps?.postId,
          cluster: cluster,
        }),
        headers: {
          'X-Csrf-Token':
            sessionStorage.getItem('csrfToken') ??
            localStorage.getItem('csrfToken') ??
            '',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (res.status > 299 || res.status < 200) {
        return null;
      }

      const result = await res.json();
      if (result?.message) {
        toast.success('Your reaction added!', {
          dismissible: true,
          duration: 1000 * 5,
        });
        postReactionsData.postReactions.push({
          id: Date.now(),
          date_created: new Date().toISOString(),
          reaction: {
            value:
              (pageProps?.reactions as ReactionType[]).find(
                (item) => item.id == reactionId,
              )?.value ?? 'like',
          },
          post: {
            id: pageProps?.postId as number,
          },
        });
        countReactions(postReactionsData.postReactions);
      } else {
        toast.error('Something went wrong!', {
          dismissible: true,
          duration: 1000 * 5,
        });
      }
    };
    return {
      ...pageProps,
      postReactions: postReactionsData.postReactions,
      countReaction: postReactionsData.countReaction,
      comments: commentsData.comments,
      reactions: pageProps?.reactions,
      handleClickReaction,
      selectSuggestion,
      groupComments,
      submitComment,
      updateComment,
      commentValue,
      slug,
    };
  },
});
</script>
