<template>
  <div class="blog-hero min-h-[100vh] mb-8">
    <div
      class="container flex justify-center items-center px-5 pt-16 pb-5 h-full"
    >
      <div class="backdrop w-full h-full p-5 rounded-xl text-white h-full">
        <h1 class="font-bold text-7xl text-center uppercase mb-5">Blog</h1>
        <h2 class="font-bold text-3xl text-center">Your Query Search Here</h2>
        <div class="search-box my-2 w-1/2 mx-auto relative">
          <input
            type="text"
            :value="search"
            @input="$emit('update:search', $event.target.value)"
            placeholder="Search Here..."
            class="block w-full rounded-lg py-2 px-3 text-xl text-text outline-0 border-2 border-transparent focus:border-secondary"
          />
          <div
            class="absolute top-1/2 right-5 -translate-y-1/2 text-text text-xl"
          >
            <component :is="Search"></component>
          </div>
        </div>
        <div :class=" { 'visibility-hidden opacity-0 ': search} " class="featured-blogs transition duration-500">
          <div class="intro flex items-center gap-5 mb-5">
            <h3 class="font-bold text-xl uppercase">Most Popular</h3>
            <div
              class="flex-grow h-[2px] bg-white rounded relative before:w-2 before:h-2 before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:bg-white before:rounded-full"
            ></div>
          </div>
          <div class="bolgs flex justify-between flex-wrap gap-8 text-xs">
            <article
              v-for="blog in featuresBlogs"
              :key="blog.id"
              class="blog flex items-center gap-3 border border-secondary rounded-md p-2"
              style="flex: 1 1 30%"
            >
              <div class="media" style="flex: 1 1 40%">
                <img :src="blog.image" class="rounded-md" :alt="blog.title" />
              </div>
              <div class="content" style="flex: 1 1 60%">
                <h3 class="font-bold text-lg text-secondary">
                  {{ blog.title }}
                </h3>
                <p class="italic text-gray-500">Date: {{ blog.date }}</p>
                <p class="description my-2 text-justify">
                  {{ blog.description }}
                </p>
                <a
                  href="#"
                  class="font-bold text-secondary flex items-center gap-2 uppercase transition hover:text-secondary-dark"
                  >Read More
                  <component
                    :is="RightArrow"
                    class="text-xl"
                    style="bottom: 0"
                  ></component>
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import RightArrow from '#icons/solid/long-arrow-right.svg';
import Search from '#icons/solid/search.svg';
import { ref } from 'vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

const featuresBlogs = ref([
  {
    id: 1,
    title: 'Feature Blog 1',
    date: '22-04-2022',
    description:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document.',
    image: 'https://via.placeholder.com/150x140',
  },
  {
    id: 2,
    title: 'Feature Blog 2',
    date: '22-04-2022',
    description:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document.',
    image: 'https://via.placeholder.com/150x140',
  },
  {
    id: 3,
    title: 'Feature Blog 3',
    date: '22-04-2022',
    description:
      'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document.',
    image: 'https://via.placeholder.com/150x140',
  },
]);
</script>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  background-blend-mode: multiply;
}
.blog-hero {
  background-size: cover;
  background: url('assets/images/HeroBackground.svg') no-repeat center center;
}
</style>
