<template>
  <div class="mx-5">
    <div class="intro my-5">
      <page-title title="ব্লগ সমূহ" />
      <p class="text-center text-gray-500 dark:text-gray-200">
        আমাদের সফটওয়ার বিষয়ক সকল প্রকার আপডেট পেতে চোখ রাখুন ব্লগ পেজে
      </p>
    </div>
    <div class="featured-blogs transition duration-500">
      <div class="intro flex items-center gap-5 mb-5">
        <h3 class="font-bold text-xl uppercase">সবচেয়ে প্রফুলার</h3>
        <div
          class="flex-grow h-[2px] bg-gray-300 dark:bg-white rounded relative before:w-2 before:h-2 before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:bg-gray-300 dark:before:bg-white before:rounded-full"
        ></div>
      </div>
      <div class="blogs flex justify-between flex-wrap gap-8 text-xs">
        <article
          v-for="blog in featuredPosts"
          :key="blog.id"
          class="blog flex flex-col lg:flex-row text-center lg:text-left items-center gap-3 border border-primary dark:border-secondary rounded-md p-2"
          style="flex: 1 1 300px"
        >
          <div class="media" style="flex: 1 1 40%">
            <a :href="'/blog/' + blog.slug">
              <img
                :src="'/assets/' + blog.featured_image"
                class="rounded-md"
                :alt="blog.title"
              />
            </a>
          </div>
          <div class="content" style="flex: 1 1 60%">
            <h3 class="font-bold text-lg text-primary dark:text-secondary">
              <a :href="'/blog/' + blog.slug">
                {{ blog.title }}
              </a>
            </h3>
            <p class="italic text-gray-500">
              তারিখ: {{ blog.date_created.split('T')[0] }}
            </p>
            <p class="description my-2 text-center lg:text-justify">
              {{
                blog.short_content.length > 50
                  ? blog.short_content.slice(0, 50) + '...'
                  : blog.short_content
              }}
            </p>
            <a
              :href="'/blog/' + blog.slug"
              class="font-bold text-primary dark:text-secondary flex items-center justify-center lg:justify-start gap-2 uppercase transition hover:text-secondary-dark"
              >আরো পড়ুন
              <RightArrow class="text-xl" style="bottom: 0" />
            </a>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import RightArrow from '#icons/solid/long-arrow-right.svg';
import PageTitle from '#components/ui/page-title.vue';

defineProps(['featuredPosts', 'search', 'category', 'categories']);
defineEmits(['update:search', 'update:category']);
</script>
