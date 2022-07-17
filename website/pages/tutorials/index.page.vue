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
        <right-item
          :isActive="activeHash === header.id"
          @click="activeHash = header.id"
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
                  <a
                    class="flex items-center gap-3 font-bold"
                    title="Prev Title"
                    href="#"
                  >
                    <arrow-left style="bottom: 0" />
                    <span>Previous</span>
                  </a>
                  <a
                    class="flex items-center gap-3 font-bold"
                    title="Next Title"
                    href="#"
                  >
                    <span>Next</span>
                    <arrow-right style="bottom: 0" />
                  </a>
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
    TheLoading,
    RightItem,
    RightSectionContainer,
    TutorialPage,
    ArrowRight,
    ArrowLeft,
    ListItem,
    TheList,
  },

  async setup() {
    const ctx = usePageContext();
    const route = useRoute();

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

    onMounted(async () => {
      if (!data.tutorials) {
        await reloadTutorials();
      }

      if (!data.tutorial) {
        await reloadTutorial();
      }

      watch(route, reloadTutorial);
    });

    return {
      currentSlug: ctx.urlPathname.split('/')[2],
      activeHash,
      headers,
      data,
    };

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
