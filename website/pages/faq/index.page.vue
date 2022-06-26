<template>
  <layout-main>
    <common-scrollable-hero>
      <hero-section />
    </common-scrollable-hero>
    <div class="container my-10">
      <div
        class="search-box my-5 md:w-1/2 mx-auto relative shadow-md border border-gray-50 rounded"
      >
        <input
          type="text"
          :value="search"
          @input="$emit('update:search', $event.target.value)"
          placeholder="Search Here..."
          class="block w-full rounded-lg py-2 px-3 text-xl text-text outline-0 border-2 border-transparent focus:border-secondary"
        />
        <div
          class="absolute top-1/2 right-5 -translate-y-1/2 text-text text-xl hidden md:block"
        >
          <component :is="SearchIcon"></component>
        </div>
      </div>
      <the-accordion
        v-for="question of questions"
        :key="question.id"
        :title="question.title"
        :description="question.content"
      />
      <the-pagination
        @change-page="handleChangePage"
        :total="totalPage"
        :activePage="activePage"
      />
    </div>
  </layout-main>
</template>

<script lang="ts">
import { Pagination as ThePagination } from '#components/ui/pagination';
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import HeroSection from '#components/faq-page/hero-section.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import TheAccordion from '#components/ui/accordion.vue';
import SearchIcon from '#icons/light/search.svg';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'faq-page',
  components: {
    CommonScrollableHero,
    ThePagination,
    TheAccordion,
    HeroSection,
    LayoutMain,
    PrimaryBtn,
  },
  props: ['questions', 'questionsAggregate'],
  data() {
    return {
      totalPage: Math.ceil(Number(this.questionsAggregate[0].count) / 10),
      activePage: 1,
    };
  },
  mounted() {
    const currentPage = Number(location.search.split('=')[1]);
    console.log('currentPage No: ', currentPage);
    this.activePage = !isNaN(currentPage) ? currentPage : 1;
  },
  methods: {
    handleChangePage(page: number) {
      this.activePage = page;
      console.log(page);
    },
  },
  setup() {
    return {
      SearchIcon,
    };
  },
});
</script>
