<template>
  <layout-main :isSticky="isSticky">
    <common-scrollable-hero v-show="!isSearching">
      <hero-section />
    </common-scrollable-hero>
    <div
      class="container mb-10"
      :class="{ 'mt-40': isSearching, 'mt-20': !isSearching }"
    >
      <div
        class="search-box flex my-5 md:w-1/2 mx-auto relative shadow-md border border-gray-50 rounded overflow-hidden"
      >
        <div class="grow">
          <input
            type="text"
            v-model="search"
            placeholder="Search Here..."
            @keyup.enter="handleQuery('sq', search)"
            class="block w-full py-2 px-3 text-xl text-text outline-0 border-2 border-transparent focus:border-secondary"
          />
        </div>
        <div
          @click="handleQuery('sq', search)"
          class="flex justify-center items-center p-3 text-xl md:block bg-primary text-white cursor-pointer"
        >
          <component :is="SearchIcon"></component>
        </div>
      </div>
      <the-accordion
        v-show="isSearching"
        v-for="question of isSearching ? questionsBySearch : questions"
        :key="question.id"
        :title="question.title"
        :description="question.content"
      />
      <the-pagination
        v-show="!isSearching"
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
import SearchIcon from '#icons/solid/search.svg';
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
  props: [
    'questionsAggregate',
    'questionsBySearch',
    'searchText',
    'questions',
    'isSticky',
  ],
  data() {
    return {
      totalPage: Math.ceil(Number(this.questionsAggregate[0].count) / 10),
      isSearching: false,
      activePage: 1,
      search: '',
    };
  },
  mounted() {
    const currentPage = Number(location.search.split('=')[1]);
    this.activePage = !isNaN(currentPage) ? currentPage : 1;
    this.isSearching = !!this.searchText;
    this.search = this.searchText;
  },
  methods: {
    handleChangePage(page: number) {
      this.activePage = page;
      console.log(page);
    },
    handleQuery(key: string, val: string) {
      const uri = window.location.href
        .replace(
          RegExp('([?&]' + key + '(?=[=&#]|$)[^#&]*|(?=#|$))'),
          '&' + key + '=' + encodeURIComponent(val),
        )
        .replace(/^([^?&]+)&/, '$1?');
      window.location.href = uri;
    },
  },
  setup() {
    return {
      SearchIcon,
    };
  },
});
</script>
