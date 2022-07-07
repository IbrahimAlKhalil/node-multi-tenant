<template>
  <div
    class="pt-10 pl-5 flex flex-col justify-between"
    style="min-height: 90vh"
    v-if="tutorial"
  >
    <section class="intro-meta pb-8 border-b border-b-gray-200" style="flex: 2">
      <component
        v-for="block of tutorial?.content?.blocks"
        :key="block.id"
        :is="'editor-' + block.type"
        :data="block.data"
        :id="block.id"
      >
      </component>
    </section>

    <slot name="footer" />
  </div>
  <div
    class="flex flex-col justify-center items-center text-red-500 font-bold text-xl uppercase"
    style="min-height: 90vh"
    v-else
  >
    <span>🔍</span>
    <span class="text-2xl">No tutorial</span>
    <span class="text-gray-500 lowercase tracking-wide">available!</span>
  </div>
</template>

<script lang="ts">
import PostDescriptionSection from '#components/post-page/description-section.vue';
import { TheList, ListItem } from '#components/ui/list';
import TutorialPage from '#layouts/tutorial-page.vue';

import {
  RightSectionContainer,
  RightItem,
} from '#components/tutorials-page/right-section';
import { defineComponent } from 'vue';
import {
  NestedList,
  Delimiter,
  Paragraph,
  CheckList,
  Header,
  Image,
  Quote,
} from '#components/editor-js-components';

export default defineComponent({
  name: 'the-tutorial',
  props: ['headers', 'tutorial'],
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
});
</script>
