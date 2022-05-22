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

<script setup lang="ts">
import { ref } from 'vue';
import UnderlineHeading from '#components/ui/underline-heading.vue';

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
