<template>
  <div class="sidebar h-full bg-primary-lighter p-3 rounded-lg">
    <div class="flex flex-col gap-5">
      <div class="search">
        <h5>Search Bolg</h5>
        <input
          type="text"
          placeholder="Search"
          v-model="search"
          @keyup.enter="searchBlog"
        />
      </div>
      <div class="category">
        <h5>Category</h5>
        <ul>
          <li
            v-for="category in categories"
            :key="category.id"
            :class="{ active: category.id == activeCategory }"
          >
            <a href="#" @click.prevent="setActiveCategory(category.id)">{{
              category.name
            }}</a>
          </li>
        </ul>
      </div>
      <div class="menu">
        <h5>Menu</h5>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>
      <div class="tags">
        <h5>Tags</h5>
        <ul>
          <li
            v-for="tag in tags"
            :key="tag.id"
            :class="{ active: tag.id == activeTag }"
          >
            <a href="#" @click.prevent="setActiveTag(tag.id)">{{ tag.name }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
  },
  data() {
    return {
      activeCategory: 0,
      activeTag: 0,
      search: '',
    };
  },
  setup: function () {
    return {};
  },
});
</script>

<style scoped></style>
