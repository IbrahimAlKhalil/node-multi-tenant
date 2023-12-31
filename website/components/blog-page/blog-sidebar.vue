<template>
  <div
    class="sidebar h-full bg-primary-lighter dark:bg-dark text-text dark:text-light p-3 rounded-lg"
  >
    <div class="flex flex-col gap-5">
      <div class="search">
        <h5 class="font-bold text-xl text-primary mb-3">ব্লগ সার্চ করুন</h5>
        <div
          class="search-box flex my-5 mx-auto relative shadow-md border border-gray-50 rounded overflow-hidden"
        >
          <div class="grow">
            <input
              type="text"
              v-model="model.search"
              placeholder="এখানে সার্চ করুন..."
              @keyup.enter="handleQuery('sq', model.search)"
              class="block w-full py-2 px-3 text-text outline-0 border-2 border-transparent focus:border-secondary"
            />
          </div>
          <div
            @click="handleQuery('sq', model.search)"
            class="flex justify-center items-center p-3 text-xl md:block bg-primary text-white cursor-pointer"
          >
            <SearchIcon style="bottom: 0" />
          </div>
        </div>
      </div>
      <div class="category">
        <h5 class="font-bold text-xl text-primary mb-3">ক্যাটেগরী সমূহ</h5>
        <ul class="font-bold">
          <li
            :class="{
              'text-secondary-dark font-bold': '' === model.category,
            }"
          >
            <input
              v-model="model.category"
              type="radio"
              name="category"
              id="all"
              value=""
              class="hidden"
              @change="handleChangeCategory('')"
            />
            <label
              for="all"
              class="flex items-center gap-2 cursor-pointer px-2"
            >
              <CircleCheck v-show="'' === model.category" />
              <Circle v-show="'' !== model.category" />
              All</label
            >
          </li>
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{
              'text-secondary-dark font-bold': category.id == model.category,
            }"
          >
            <input
              v-model="model.category"
              type="radio"
              name="category"
              :id="category.slug"
              :value="category.id"
              class="hidden"
              @change="handleChangeCategory(model.category)"
            />
            <label
              :for="category.slug"
              class="flex items-center gap-2 cursor-pointer px-2"
            >
              <CircleCheck v-show="category.id == model.category" />
              <Circle v-show="category.id != model.category" />

              {{ category.name }}</label
            >
          </li>
        </ul>
      </div>
      <div class="tags">
        <h5 class="font-bold text-xl text-primary mb-3">ট্যাগ সমূহ</h5>
        <ul class="font-bold">
          <li
            :class="{
              'text-secondary-dark font-bold': '' == model.tag,
            }"
          >
            <input
              v-model="model.tag"
              type="radio"
              name="tag"
              id="tag-all"
              value=""
              class="hidden"
              @change="handleChangeTag('')"
            />
            <label
              for="tag-all"
              class="flex items-center gap-2 cursor-pointer px-2"
            >
              <CircleCheck v-show="'' == model.tag" />
              <Circle v-show="'' != model.tag" />

              All</label
            >
          </li>
          <li
            v-for="tag in tags"
            :key="tag.id"
            :class="{
              'text-secondary-dark font-bold': tag.id == model.tag,
            }"
          >
            <input
              v-model="model.tag"
              type="radio"
              name="tag"
              :id="tag.name"
              :value="tag.id"
              class="hidden"
              @change="handleChangeTag(model.tag)"
            />
            <label
              :for="tag.name"
              class="flex items-center gap-2 cursor-pointer px-2"
            >
              <CircleCheck v-show="tag.id == model.tag" />
              <Circle v-show="tag.id != model.tag" />

              {{ tag.name }}</label
            >
          </li>
        </ul>
      </div>
      <div>
        <a href="/blog">
          <button
            class="w-full p-1 border border-secondary hover:border-secondary-dark hover:bg-secondary-dark text-secondary-dark hover:text-white rounded-md font-bold text-lg flex items-center justify-center gap-2"
          >
            <TrashIcon />
            ফিল্টার রিসেট করুন
          </button>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { usePageContext } from '#modules/use-page-context';
import CircleCheck from '#icons/solid/check-circle.svg';
import TrashIcon from '#icons/solid/trash-alt.svg';
import { defineComponent, reactive, watch } from 'vue';
import SearchIcon from '#icons/solid/search.svg';
import Circle from '#icons/light/circle.svg';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'blog-sidebar',
  components: { SearchIcon, CircleCheck, Circle, TrashIcon },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    activeCategory: {
      type: String,
      required: true,
    },
    activeTag: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleChangeCategory(category: string) {
      this.handleQuery('page', '1');
      this.handleQuery('category', category);
    },
    handleChangeTag(tag: string) {
      this.handleQuery('page', '1');
      this.handleQuery('tag', tag);
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
  emits: ['update:search', 'update:category', 'update:tag'],
  setup(_, { emit }) {
    const { pageProps } = usePageContext();
    const i18n = useI18n();
    const model = reactive({
      search: pageProps?.searchText ?? '',
      category: pageProps?.category ?? '',
      tag: pageProps?.tag ?? '',
    });
    const keys = Object.keys(model) as (keyof typeof model)[];
    for (let key of keys) {
      watch(
        () => model[key],
        (value) => emit(`update:${key}`, value),
      );
    }
    return {
      t: i18n.t,
      model,
    };
  },
});
</script>
