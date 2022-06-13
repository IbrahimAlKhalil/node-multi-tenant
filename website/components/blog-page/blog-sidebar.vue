<template>
  <div
    class="sidebar h-full bg-primary-lighter dark:bg-dark text-text dark:text-light p-3 rounded-lg"
  >
    <div class="flex flex-col gap-5">
      <div class="search">
        <h5 class="font-bold text-xl text-primary mb-3">Search Bolg</h5>
        <input
          type="text"
          placeholder="Search"
          :value="sidebarSearch"
          @input="$emit('update:search', $event.target.value)"
          class="w-full border border-primary-light rounded-lg p-2"
        />
      </div>
      <div class="category">
        <h5 class="font-bold text-xl text-primary mb-3">Category</h5>
        <ul>
          <li
            :class="{ active: 'all' === activeCategory }"
            @click="$emit('update:category', 'all')"
          >
            <span
              class="flex items-center gap-2 my-1 cursor-pointer"
              :class="{
                'text-secondary-dark font-bold': 'all' === activeCategory,
              }"
            >
              <component
                :is="'all' === activeCategory ? CircleCheck : Circle"
              />
              All
            </span>
          </li>
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{ active: category.slug === activeCategory }"
            @click="$emit('update:category', category.slug)"
          >
            <span
              class="flex items-center gap-2 my-1 cursor-pointer"
              :class="{
                'text-secondary-dark font-bold':
                  category.slug === activeCategory,
              }"
            >
              <component
                :is="category.slug === activeCategory ? CircleCheck : Circle"
              />
              {{ category.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="tags">
        <h5 class="font-bold text-xl text-primary mb-3">Tags</h5>
        <ul>
          <li
            :class="{
              active: 'all' === activeTag.toLowerCase(),
            }"
            @click="$emit('update:tag', 'All')"
          >
            <span
              class="flex items-center gap-2 my-1 cursor-pointer"
              :class="{
                'text-secondary-dark font-bold':
                  'all' === activeTag.toLowerCase(),
              }"
            >
              <component
                :is="'all' === activeTag.toLowerCase() ? CircleCheck : Circle"
              />All
            </span>
          </li>
          <li
            v-for="tag in tags"
            :key="tag.id"
            :class="{
              active: tag.name.toLowerCase() === activeTag.toLowerCase(),
            }"
            @click="$emit('update:tag', tag.name)"
          >
            <span
              class="flex items-center gap-2 my-1 cursor-pointer"
              :class="{
                'text-secondary-dark font-bold':
                  tag.name.toLowerCase() === activeTag.toLowerCase(),
              }"
            >
              <component
                :is="
                  tag.name.toLowerCase() === activeTag.toLowerCase()
                    ? CircleCheck
                    : Circle
                "
              />
              {{ tag.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import CircleCheck from '#icons/solid/check-circle.svg';
import Circle from '#icons/light/circle.svg';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'blog-sidebar',
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
    sidebarSearch: {
      type: String,
      required: true,
    },
  },
  emits: ['update:search', 'update:category', 'update:tag'],
  setup() {
    const i18n = useI18n();

    return {
      CircleCheck,
      Circle,
      t: i18n.t,
    };
  },
});
</script>
