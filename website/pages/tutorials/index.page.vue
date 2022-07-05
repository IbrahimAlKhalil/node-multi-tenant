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
        ></list-item>
      </the-list>
    </template>

    <template #right-sidebar>
      <right-section-container>
        <right-item title="Right Sidebar" slug="test" :isActive="true" />
        <right-item title="Right Sidebar" slug="test" />
      </right-section-container>
    </template>

    <template #main>
      <div class="pt-10 pl-5 min-h-full flex flex-col justify-between">
        <section class="intro-meta pb-8 border-b border-b-gray-200">
          <post-description-section
            :content="tutorials[0].content"
            class="w-full"
          />
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
import { ListItem } from '#components/ui/list';
import { TheList } from '#components/ui/list';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    'right-item': RightItem,
    PostDescriptionSection,
    RightSectionContainer,
    TutorialPage,
    ListItem,
    TheList,
  },
  props: ['tutorialCategories', 'tutorials'],
  setup() {
    return {
      ArrowLeft,
      ArrowRight,
    };
  },
});
</script>
