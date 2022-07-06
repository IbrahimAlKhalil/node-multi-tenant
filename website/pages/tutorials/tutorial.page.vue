<template>
  <TutorialPage>
    <template #left-sidebar>
      <h1
        class="font-bold text-xl text-center text-secondary md:text-primary border-b border-b-gray-300 p-5 uppercase"
      >
        Software Tutorial
      </h1>
      <the-list>
        <list-item
          v-for="item of tutorialCategories"
          :key="item.slug"
          :data="item"
          :currentSlug="currentSlug"
        ></list-item>
      </the-list>
    </template>

    <template #right-sidebar>
      <right-section-container>
        <right-item
          v-for="header of headers"
          :key="header.id"
          :title="header.data.text"
          :slug="'#' + header.id"
          :isActive="activeHash === header.id"
          @click="activeHash = header.id"
        />
      </right-section-container>
    </template>

    <template #main v-if="tutorial">
      <div
        class="pt-10 pl-5 flex flex-col justify-between"
        style="min-height: 90vh"
      >
        <section
          class="intro-meta pb-8 border-b border-b-gray-200"
          style="flex: 2"
        >
          <component
            v-for="block of tutorial?.content?.blocks"
            :key="block.id"
            :is="'editor-' + block.type"
            :data="block.data"
            :id="block.id"
          >
          </component>
        </section>
        <footer class="py-5 border-t border-t-gray-300">
          <div class="w-11/12 mx-auto flex justify-between items-center">
            <a href="#" class="flex items-center gap-3 font-bold">
              <component :is="ArrowLeft" style="bottom: 0"></component>
              <span>Previous</span>
            </a>
            <a href="#" class="flex items-center gap-3 font-bold">
              <span>Next</span>
              <component :is="ArrowRight" style="bottom: 0"></component>
            </a>
          </div>
        </footer>
      </div>
    </template>
    <template #main v-else>
      <div
        class="flex flex-col justify-center items-center text-red-500 font-bold text-xl uppercase"
        style="min-height: 90vh"
      >
        <span>🔍</span>
        <span class="text-2xl">No tutorial</span>
        <span class="text-gray-500 lowercase tracking-wide">available!</span>
      </div>
    </template>
  </TutorialPage>
</template>

<script lang="ts">
import PostDescriptionSection from '#components/post-page/description-section.vue';
import ArrowRight from '#icons/solid/arrow-right.svg';
import TutorialPage from '#layouts/tutorial-page.vue';
import ArrowLeft from '#icons/solid/arrow-left.svg';
import {
  RightSectionContainer,
  RightItem,
} from '#components/tutorials-page/right-section';
import { TheList, ListItem } from '#components/ui/list';
import { defineComponent, ref } from 'vue';
import {
  NestedList,
  Delimiter,
  Paragraph,
  CheckList,
  Header,
  Image,
  Quote,
} from '#components/editor-js-components';
import { usePageContext } from '#modules/use-page-context';

export default defineComponent({
  name: 'the-tutorial',
  props: ['tutorial', 'tutorialCategories'],
  components: {
    'right-item': RightItem,
    PostDescriptionSection,
    RightSectionContainer,
    TutorialPage,
    ListItem,
    TheList,
    'editor-nestedlist': NestedList,
    'editor-paragraph': Paragraph,
    'editor-delimiter': Delimiter,
    'editor-checklist': CheckList,
    'editor-header': Header,
    'editor-image': Image,
    'editor-quote': Quote,
  },
  data() {
    return {
      headers: [],
      activeHash: '',
    };
  },
  mounted() {
    this.headers = this.tutorial?.content?.blocks
      ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.tutorial.content.blocks.filter((block) => block.type === 'header')
      : [];
  },
  setup() {
    const { urlPathname } = usePageContext();
    const currentSlug = ref(urlPathname.split('/')[2]);
    return {
      currentSlug,
      ArrowRight,
      ArrowLeft,
    };
  },
});
</script>
