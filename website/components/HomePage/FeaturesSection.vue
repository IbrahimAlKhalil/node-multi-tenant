<template>
  <div class="features-section absolute -bottom-20 w-full hidden">
    <div
      class="bg-white rounded-lg shadow-lg w-4/5 mx-auto px-8 py-5 flex justify-between"
    >
      <!-- ================== Item Start ===================== -->
      <div
        v-for="item in items"
        :key="item.id"
        class="item flex items-center gap-5"
      >
        <img :src="item.icon" alt="quran" width="90px" />
        <div class="text">
          <h3 class="font-bold text-primary text-2xl">{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
      <!-- Item End -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'features-section',
  data() {
    return {
      items: [
        {
          id: '1',
          icon: '/assets/images/quran.svg',
          title: 'Computerized',
          description: 'Lorem ipsum dolor sit amet.',
        },
        {
          id: '2',
          icon: '/assets/images/quran.svg',
          title: 'Computerized',
          description: 'Lorem ipsum dolor sit amet.',
        },
        {
          id: '3',
          icon: '/assets/images/quran.svg',
          title: 'Computerized',
          description: 'Lorem ipsum dolor sit amet.',
        },
      ],
    };
  },
});
</script>
