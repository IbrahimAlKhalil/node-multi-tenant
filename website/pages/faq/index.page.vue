<template>
  <layout-main>
    <hero-section />
    <div class="container my-10">
      <div class="flex flex-col items-center mb-8">
        <primary-btn title="Frequently Asked Questions" />
      </div>
      <the-accordion
        v-for="question of questions"
        :key="question.id"
        :title="question.title"
        :description="question.content"
      />
      <the-pagination
        @change-page="handleChangePage"
        :total="10"
        :activePage="activePage"
      />
    </div>
  </layout-main>
</template>

<script lang="ts">
import { Pagination as ThePagination } from '#components/ui/pagination';
import HeroSection from '#components/faq-page/hero-section.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import TheAccordion from '#components/ui/accordion.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'faq-page',
  components: {
    TheAccordion,
    ThePagination,
    HeroSection,
    LayoutMain,
    PrimaryBtn,
  },
  props: ['questions'],
  data() {
    return {
      activePage: 1,
      topQuestions: [
        {
          id: 1,
          title: 'This is testing question 01',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          id: 2,
          title: 'This is testing question 02',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          id: 3,
          title: 'This is testing question 03',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
          id: 4,
          title: 'This is testing question 04',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur s',
        },
      ],
    };
  },
  methods: {
    handleChangePage(page: number) {
      this.activePage = page;
      console.log(page);
    },
  },
  setup() {
    return {};
  },
});
</script>
