<template>
  <layout-main>
    <div
      v-if="is404"
      class="container mx-auto flex flex-col items-center justify-center p-10 min-h-[75vh]"
    >
      <h1 class="font-bold text-xl text-red-500 mb-5">404 Page Not Found</h1>
      <p>This page could not be found.</p>
      <a href="/">
        <button class="px-3 py-1 rounded bg-primary text-white font-bold my-5">
          Back To Home!
        </button>
      </a>
    </div>
    <div
      v-else
      class="container mx-auto flex flex-col items-center justify-center p-10 min-h-[75vh]"
    >
      <h1 class="font-bold text-xl text-red-500 mb-5">
        500 Internal Server Error
      </h1>
      <p>Something went wrong.</p>
      <a href="/">
        <button class="px-3 py-1 rounded bg-primary text-white font-bold my-5">
          Back To Home!
        </button>
      </a>
    </div>
  </layout-main>
</template>

<script lang="ts" setup>
import LayoutMain from '#layouts/main.vue';

defineProps(['is404']);
</script>
