<template>
  <TutorialPage>
    <template #left-sidebar>
      <the-list v-if="data.tutorials">
        <list-item
          v-for="item of data.tutorials"
          :current-slug="currentSlug"
          :key="item.slug"
          :data="item"
        ></list-item>
      </the-list>
      <the-loading v-else />
    </template>

    <template #right-sidebar>
      <right-section-container v-if="headers">
        <!-- header.data.text -->
        <right-item
          :isActive="hashActive === header.id"
          v-for="header of headers"
          :title="header.data.text"
          :slug="'#' + header.id"
          :key="header.id"
        />
      </right-section-container>
      <the-loading v-else />
    </template>

    <template #main>
      <router-view v-slot="{ Component }">
        <Suspense>
          <component
            :tutorial="data.tutorial"
            v-if="data.tutorial"
            :headers="headers"
            :is="Component"
          >
            <template #footer>
              <footer class="py-5 border-t border-t-gray-300">
                <div class="w-11/12 mx-auto flex justify-between items-center">
                  <router-link
                    :class="{
                      'pointer-events-none': !prevTutorial,
                      'text-gray-400': !prevTutorial,
                    }"
                    :to="`/tutorials/${prevTutorial?.slug ?? ''}`"
                    class="flex items-center gap-3 font-bold"
                    :title="prevTutorial?.title ?? ''"
                  >
                    <arrow-left style="bottom: 0" />
                    <span>Previous</span>
                  </router-link>
                  <router-link
                    :class="{
                      'pointer-events-none': !nextTutorial,
                      'text-gray-400': !nextTutorial,
                    }"
                    :to="`/tutorials/${nextTutorial?.slug ?? ''}`"
                    class="flex items-center gap-3 font-bold"
                    :title="nextTutorial?.title ?? ''"
                  >
                    <span>Next</span>
                    <arrow-right style="bottom: 0" />
                  </router-link>
                </div>
              </footer>
            </template>
          </component>

          <the-loading v-else />
        </Suspense>
      </router-view>
    </template>
  </TutorialPage>
</template>

<script lang="ts">
import { usePageContext } from '#modules/use-page-context';
import ArrowRight from '#icons/solid/arrow-right.svg';
import TutorialPage from '#layouts/tutorial-page.vue';
import ArrowLeft from '#icons/solid/arrow-left.svg';
import { loadTutorials } from './load-tutorials';
import TheLoading from '#components/loading.vue';
import { ListItem } from '#components/ui/list';
import { loadTutorial } from './load-tutorial';
import { TheList } from '#components/ui/list';
import { useItem } from '#modules/use-item';
import { useRoute } from 'vue-router';

import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';
import {
  RightSectionContainer,
  RightItem,
} from '#components/tutorials-page/right-section';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    RightSectionContainer,
    TutorialPage,
    TheLoading,
    ArrowRight,
    RightItem,
    ArrowLeft,
    ListItem,
    TheList,
  },

  async setup() {
    const ctx = usePageContext();
    const route = useRoute();

    const hashActive = ref('');

    const data = reactive<Record<string, any>>(
      ctx.pageProps
        ? ctx.pageProps
        : {
            tutorials: null,
            tutorial: null,
          },
    );

    const headers = computed(() => {
      if (!data.tutorial) {
        return null;
      }

      if (!data.tutorial.content?.blocks) {
        return [];
      }

      return data.tutorial.content.blocks.filter(
        (block: any) => block.type === 'header',
      );
    });
    const activeHash = ref('');

    const nextTutorial = computed(() => {
      if (!data.tutorials?.length) {
        return '#';
      }

      let item: Record<string, any> | null = null;
      const length = data.tutorials.length;

      for (let i = 0; i < length; i++) {
        if (data.tutorials[i].slug === route.params.slug) {
          return data.tutorials[i + 1];
        }
      }

      return item;
    });
    const prevTutorial = computed(() => {
      if (!data.tutorials?.length) {
        return '#';
      }

      let item: Record<string, any> | null = null;
      const length = data.tutorials.length;

      for (let i = 0; i < length; i++) {
        if (data.tutorials[i].slug === route.params.slug) {
          return data.tutorials[i + -1];
        }
      }

      return item;
    });

    let io: IntersectionObserver | null;

    onMounted(async () => {
      if (!data.tutorials) {
        await reloadTutorials();
      }

      if (!data.tutorial) {
        await reloadTutorial();
      }

      watch(route, async () => {
        await reloadTutorial();
        initSectionRouting();
      });

      initSectionRouting();
    });

    onUnmounted(() => {
      if (io) {
        io.disconnect();
      }
    });

    return {
      currentSlug: route.params.slug,
      activeRoute: route,

      nextTutorial,
      prevTutorial,
      hashActive,
      activeHash,
      headers,
      data,
    };

    function initSectionRouting() {
      if (io) {
        io.disconnect();
      }

      io = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.intersectionRatio > 0) {
          hashActive.value = entry.target.id;
        }
      });

      document.querySelectorAll('.qmm_heading').forEach(io.observe.bind(io));
    }

    async function reloadTutorials() {
      const itemService = useItem('tutorial');

      data.tutorials = Object.freeze(await loadTutorials(itemService));
    }

    async function reloadTutorial() {
      const itemService = useItem('tutorial');

      data.tutorial = await loadTutorial(
        itemService,
        (route.params.slug ?? data.tutorials?.[0]?.slug ?? '') as string,
      );
    }
  },
});
</script>
