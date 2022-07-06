<template>
  <h3 class="text-text dark:text-light text-center text-lg font-bold mb-5">
    Was this article helpful?
  </h3>
  <div class="flex justify-center items-center">
    <emoji-frame :size="12" v-for="emoji of reactions" :key="emoji.id">
      <component
        :is="'Emoji' + emoji.type"
        :id="emoji.id"
        class="scale-[30%] grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
        @handle-click="handleClick"
      ></component>
    </emoji-frame>
  </div>
</template>

<script lang="ts">
import { useAuth } from '#stores/auth.store';
import {
  EmojiLike,
  EmojiAngry,
  EmojiSad,
  EmojiWow,
  EmojiFrame,
} from '#components/animated-reactions';
import { defineComponent } from 'vue';
import { usePageContext } from '#modules/use-page-context';

export default defineComponent({
  name: 'reactions-section',
  components: {
    EmojiLike,
    EmojiAngry,
    EmojiSad,
    EmojiWow,
    EmojiFrame,
  },
  props: ['reactions'],
  setup() {
    const auth = useAuth();
    const { pageProps } = usePageContext();
    const handleClick = async (reactionName: number | string) => {
      const cluster = localStorage.getItem('cluster');
      console.log('cluster in client: ', cluster);
      if (!auth.user || !cluster) {
        location.replace('/login');
      }
      const res = await fetch('/api/reaction', {
        method: 'POST',
        body: JSON.stringify({
          reaction: reactionName,
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
      console.log(result);
    };
    return {
      handleClick,
    };
  },
});
</script>
