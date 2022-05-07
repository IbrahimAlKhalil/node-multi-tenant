<template>
  <div class="widget widget_links">
    <UnderlineHeading :title="title" />
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
import UnderlineHeading from '#components/ui/UnderlineHeading.vue';
const title = ref('Important Links');
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
