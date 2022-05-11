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
            v-for="tag in tags"
            :key="tag.id"
            :class="{ active: tag.slug === activeTag }"
            @click="$emit('update:tag', tag.slug)"
          >
            <span
              class="flex items-center gap-2 my-1 cursor-pointer"
              :class="{
                'text-secondary-dark font-bold': tag.slug === activeTag,
              }"
            >
              <component :is="tag.slug === activeTag ? CircleCheck : Circle" />
              {{ tag.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CircleCheck from '#icons/solid/check-circle.svg';
import Circle from '#icons/light/circle.svg';

defineProps({
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
});
defineEmits(['update:search', 'update:category', 'update:tag']);
</script>

<style scoped></style>
