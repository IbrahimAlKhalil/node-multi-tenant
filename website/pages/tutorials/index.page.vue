<template>
  <TutorialPage>
    <template #left-sidebar>
      <the-list>
        <list-item
          :current-slug="currentSlug"
          v-for="item of tutorials"
          :key="item.slug"
          :data="item"
        ></list-item>
      </the-list>
    </template>

    <template #right-sidebar>
      <right-section-container>
        <right-item
          :isActive="activeHash === header.id"
          @click="activeHash = header.id"
          v-for="header of headers"
          :title="header.data.text"
          :slug="'#' + header.id"
          :key="header.id"
        />
      </right-section-container>
    </template>

    <template #main>
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" :headers="headers" :tutorial="tutorial">
            <template #footer>
              <footer class="py-5 border-t border-t-gray-300">
                <div class="w-11/12 mx-auto flex justify-between items-center">
                  <a
                    class="flex items-center gap-3 font-bold text-gray-400"
                    href="#"
                  >
                    <arrow-left style="bottom: 0" />
                    <span>Previous</span>
                  </a>
                  <a
                    :class="{ 'text-gray-400': !tutorials[1] }"
                    class="flex items-center gap-3 font-bold"
                    :title="tutorials[1]?.title ?? ''"
                    :href="tutorials[1]?.slug ?? '#'"
                  >
                    <span>Next</span>
                    <arrow-right style="bottom: 0" />
                  </a>
                </div>
              </footer>
            </template>
          </component>
        </Suspense>
      </router-view>
    </template>
  </TutorialPage>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { usePageContext } from '#modules/use-page-context';
import ArrowRight from '#icons/solid/arrow-right.svg';
import TutorialPage from '#layouts/tutorial-page.vue';
import ArrowLeft from '#icons/solid/arrow-left.svg';
import { ListItem } from '#components/ui/list';
import { TheList } from '#components/ui/list';
import { useItem } from '#modules/use-item';
import { useRoute } from 'vue-router';

import {
  RightSectionContainer,
  RightItem,
} from '#components/tutorials-page/right-section';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    'right-item': RightItem,
    RightSectionContainer,
    TutorialPage,
    ArrowRight,
    ArrowLeft,
    ListItem,
    TheList,
  },

  async setup() {
    const itemService = useItem('tutorial');
    const ctx = usePageContext();
    const route = useRoute();

    onMounted(() => {
      watch(route, loadTutorial);
    });

    const tutorial = ref<null | Record<string, any>>(null);
    const tutorials = await itemService.readByQuery({
      filter: {
        parent: {
          _null: true,
        },
      },
      fields: [
        'id',
        'title',
        'slug',
        'parent',
        'children.title',
        'children.slug',
        'children.children.title',
        'children.children.slug',
        'children.children.children.title',
        'children.children.children.slug',
      ],
    });

    await loadTutorial();

    const headers = computed(() => {
      return tutorial.value?.content?.blocks
        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          tutorial.value.content.blocks.filter(
            (block: any) => block.type === 'header',
          )
        : [];
    });

    const activeHash = ref('');

    return {
      tutorial: tutorial.value ? tutorial : null,
      currentSlug: ctx.urlPathname.split('/')[2],
      tutorials: Object.freeze(tutorials),
      activeHash,
      headers,
    };

    async function loadTutorial() {
      const data = await itemService.readByQuery({
        filter: {
          slug: {
            _eq: (route.params.slug ?? tutorials[0].slug ?? '') as string,
          },
        },
        fields: ['id', 'status', 'title', 'slug', 'content'],
      });

      tutorial.value = data[0];
    }
  },
});
</script>
