<template>
  <layout-main>
    <post-hero-section
      :image="post.featured_image"
      :categoryName="primaryCategory.name"
      :title="post.title"
    />
    <pre>{{ postReactionGroup }}</pre>
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
    <!-- Start Tab Section -->
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
    <tab-body v-if="activeTab === 'comments'">
      <comment-section
        :data="commentsData"
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
    <tab-body v-else-if="activeTab === 'like'">
      <tab-body-users-container>
        <tab-body-user-item
          :postReactions="
            postReactionsData.filter((react) => react.reaction.value === 'like')
          "
        />
      </tab-body-users-container>
    </tab-body>
    <tab-body v-else-if="activeTab === 'wow'">
      <tab-body-users-container>
        <tab-body-user-item
          :postReactions="
            postReactionsData.filter((react) => react.reaction.value === 'wow')
          "
        />
      </tab-body-users-container>
    </tab-body>
    <tab-body v-else-if="activeTab === 'sad'">
      <tab-body-users-container>
        <tab-body-user-item
          :postReactions="
            postReactions.filter((react) => react.reaction.value === 'sad')
          "
        />
      </tab-body-users-container>
    </tab-body>
    <tab-body v-else-if="activeTab === 'angry'">
      <tab-body-users-container>
        <tab-body-user-item
          :postReactions="
            postReactions.filter((react) => react.reaction.value === 'angry')
          "
        />
      </tab-body-users-container>
    </tab-body>
    <!-- End Tab Section -->
  </layout-main>
</template>

<script lang="ts">
import PostPageMetaDescriptionSection from '#components/post-page/meta-description.section.vue';
import PostDescriptionSection from '#components/post-page/description-section.vue';
import PostReactionsSection from '#components/post-page/reactions-section.vue';
import CommentSection from '#components/post-page/comment-section/index.vue';
import TabBodyUsersContainer from '#components/post-page/tab-body-users.vue';
import TabBodyUserItem from '#components/post-page/tab-body-user-item.vue';
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
import PostType from '#types/post-type';

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
    TabBodyUserItem,
    PostHeroSection,
    CommentSection,
    CommentIcon,
    LayoutMain,
    TabButton,
    TheTabs,
    TabBody,
    TheTab,
  },
  setup() {
    // Toast
    const toast: any = inject('$toast');
    // Context
    const { urlPathname, pageProps } = usePageContext();
    const auth = useAuth();
    const slug = urlPathname.split('/').pop();
    // Type
    type ReactionCountType = {
      Like: number;
      Wow: number;
      Sad: number;
      Angry: number;
    };
    // States
    const activeTab = ref('comments');
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
    // Post Reaction
    const postReactionsData = reactive<{
      postReactions: PostReactionType[];
      countReaction: ReactionCountType;
    }>({
      postReactions: [],
      countReaction: {} as ReactionCountType,
    });

    const postReactionGroup = computed(() =>
      _.groupBy(
        postReactionsData.postReactions.map((item) => {
          return {
            code: item?.institute?.code,
            cluster: item?.institute?.cluster?.host,
            user: item?.user_id,
          };
        }),
        'cluster',
      ),
    );

    postReactionsData.postReactions = pageProps?.postReactions
      ? [...(pageProps.postReactions as PostReactionType[])]
      : [];

    const post: PostType = (pageProps?.post as PostType) ?? ({} as PostType);

    const primaryCategory = computed(() => {
      const name = post?.primary_category
        ? post?.primary_category?.name
        : post?.categories[0]?.post_category_id?.name;

      const slug = post?.primary_category
        ? post?.primary_category?.slug
        : post?.categories[0]?.post_category_id?.slug;

      return {
        name,
        slug,
      };
    });

    // Actions
    const handleTabChange = (title: string) => {
      activeTab.value = title.toLocaleLowerCase();
    };

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
      postReactionsData: postReactionsData.postReactions,
      countReaction: postReactionsData.countReaction,
      commentsData: commentsData.comments,
      reactions: pageProps?.reactions,
      handleClickReaction,
      postReactionGroup,
      selectSuggestion,
      handleTabChange,
      primaryCategory,
      groupComments,
      submitComment,
      updateComment,
      commentValue,
      activeTab,
      slug,
    };
  },
});
</script>
