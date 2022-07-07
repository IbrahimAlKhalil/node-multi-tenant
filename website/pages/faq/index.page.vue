<template>
  <layout-main :is-sticky="true">
    <common-scrollable-hero>
      <hero-section />
    </common-scrollable-hero>
    <div class="container mb-10 mt-20">
      <div
        class="search-box flex my-5 md:w-1/2 mx-auto relative shadow-md border border-gray-50 rounded overflow-hidden"
      >
        <div class="grow">
          <input
            class="block w-full py-2 px-3 text-xl text-text outline-0 border-2 border-transparent focus:border-secondary"
            placeholder="Search Here..."
            @keyup.enter="doSearch"
            v-model="search"
            type="text"
          />
        </div>
        <div
          class="flex justify-center items-center p-3 text-xl md:block bg-primary text-white cursor-pointer"
          @click="doSearch"
        >
          <search-icon></search-icon>
        </div>
      </div>

      <template v-if="data.questions">
        <the-accordion
          v-for="question of data.questions"
          :description="question.content"
          :title="question.title"
          :key="question.id"
          v-show="search"
        />
        <the-pagination
          v-show="!search && filtered"
          @change-page="changePage"
          :activePage="activePage"
          urlWithKey="/faq?page="
          :total="totalPage"
        />
      </template>

      <template v-else>
        <div
          class="font-bold p-4 bg-primary-dark text-white rounded text-center"
        >
          Loading...
        </div>
      </template>
    </div>
  </layout-main>
</template>

<script lang="ts">
import { Pagination as ThePagination } from '#components/ui/pagination';
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import HeroSection from '#components/faq-page/hero-section.vue';
import { usePageContext } from '#modules/use-page-context';
import TheAccordion from '#components/ui/accordion.vue';
import SearchIcon from '#icons/solid/search.svg';
import { useRoute, useRouter } from 'vue-router';
import { useItem } from '#modules/use-item';
import LayoutMain from '#layouts/main.vue';
import { loadData } from './load-data';

export default defineComponent({
  name: 'faq-page',
  components: {
    CommonScrollableHero,
    ThePagination,
    TheAccordion,
    HeroSection,
    SearchIcon,
    LayoutMain,
  },
  async setup() {
    const ctx = usePageContext();
    const router = useRouter();
    const route = useRoute();

    const activePage = ref(Number(route.query.page ?? 1));
    const prevSearch = ref(route.query.sq ?? '');
    const search = ref(route.query.sq ?? '');
    const filtered = computed(() => prevSearch.value === search.value);

    const data = reactive<Record<string, any>>(
      ctx.pageProps
        ? ctx.pageProps
        : {
            questions: null,
            count: 1,
          },
    );

    onMounted(() => {
      if (!data.questions) {
        reloadData();
      }
    });

    return {
      totalPage: Math.ceil(Number(data.count) / 10),
      changePage,
      activePage,
      doSearch,
      filtered,
      search,
      data,
    };

    async function reloadData() {
      const itemService = useItem('question');

      const _data = await loadData(
        itemService,
        activePage.value,
        search.value.toString(),
      );

      data.questions = _data.questions;
      data.count = _data.count ?? 1;
    }

    async function doSearch() {
      data.questions = null;
      prevSearch.value = search.value;

      await router.push({
        query: {
          sq: search.value,
        },
      });
      await reloadData();
    }

    async function changePage(page: number) {
      activePage.value = page;
      data.questions = null;

      await router.push({
        query: {
          page: activePage.value,
        },
      });
      await reloadData();
    }
  },
});
</script>
