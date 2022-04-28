<template>
  <div class="sidebar h-full bg-primary-lighter p-3 rounded-lg">
    <div class="flex flex-col gap-5">
      <div class="search">
        <h5 class="font-bold text-xl text-primary mb-3">Search Bolg</h5>
        <input
          type="text"
          placeholder="Search"
          :value="search"
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
          >
            <a
              class="flex items-center gap-2 my-1 text-text cursor-pointer"
              :class="{
                'text-secondary-dark': category.slug === activeCategory,
              }"
            >
              <component
                :is="category.slug === activeCategory ? CircleCheck : Circle"
              />
              {{ category.name }}
            </a>
          </li>
        </ul>
      </div>
      <div class="menu">
        <h5 class="font-bold text-xl text-primary mb-3">Menu</h5>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="tags">
        <h5 class="font-bold text-xl text-primary mb-3">Tags</h5>
        <ul>
          <li
            v-for="tag in tags"
            :key="tag.id"
            :class="{ active: tag.slug === activeTag }"
          >
            <a
              class="flex items-center gap-2 my-1 text-text cursor-pointer"
              :class="{ 'text-secondary-dark': tag.slug === activeCategory }"
            >
              <component
                :is="tag.slug === activeCategory ? CircleCheck : Circle"
              />
              {{ tag.name }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import CircleCheck from '#icons/solid/check-circle.svg';
import Circle from '#icons/light/circle.svg';
import { defineComponent } from 'vue';

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
  search: {
    type: String,
    required: true,
  },
});
defineEmits(['update:search']);
</script>

<style scoped></style>
