<template>
  <div class="widget widget_links">
    <h4
      class="widget-title text-2xl bold border-b-2 border-gray-500 pb-2 mb-5 relative after:h-2 after:w-1/2 after:bg-secondary after:absolute after:left-0 after:-bottom-1 after:rounded-r"
    >
      {{ title }}
    </h4>
    <ul>
      <li
        v-for="item in links"
        :key="item.id"
        class="py-1 list-disc list-inside"
      >
        <a :href="item.url">{{ item.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Useful Links');
const links = ref([
  {
    id: 1,
    title: 'About Us',
    url: '#',
  },
  {
    id: 2,
    title: 'Contact Us',
    url: '#',
  },
  {
    id: 3,
    title: 'Privacy Policy',
    url: '#',
  },
  {
    id: 4,
    title: 'Terms of Use',
    url: '#',
  },
]);
</script>

<style scoped></style>
