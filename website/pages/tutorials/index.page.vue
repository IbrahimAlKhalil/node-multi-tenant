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
        <right-item title="Right Sidebar" slug="#test" :isActive="true" />
        <right-item title="Right Sidebar" slug="#test" />
      </right-section-container>
    </template>

    <template #main>
      <div class="pt-10 pl-5">
        <section class="intro-meta py-5 border-b border-b-gray-200">
          <h1
            class="text-4xl font-bold text-primary dark:text-secondary text-center mb-5"
          >
            This is tutorial home page
          </h1>
          <p class="w-4/5 mx-auto text-gray-500 dark:text-light text-center">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis
            voluptate recusandae corporis debitis soluta nemo, nulla eaque
            maxime cumque eum neque sunt ipsum dolore molestias!
          </p>
        </section>
        <section
          class="intro-meta py-5 border-b border-b-gray-200"
          v-for="n of 3"
          :key="n"
        >
          <h3 class="text-2xl font-bold text-primary dark:text-secondary mb-5">
            This is title.
          </h3>
          <p class="text-text dark:text-light text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consectetur modi architecto eius at natus similique. Velit, commodi
            nostrum. Ducimus laboriosam aliquam culpa vitae facere qui expedita
            architecto velit cum ullam.<br /><br />
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Consectetur modi architecto eius at natus similique. Velit, commodi
            nostrum. Ducimus laboriosam aliquam culpa vitae facere qui expedita
            architecto velit cum ullam.
          </p>
        </section>
      </div>
    </template>
  </TutorialPage>
</template>

<script lang="ts">
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
