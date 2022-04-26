<template>
  <div class="our-clients-section my-10">
    <div class="container mx-auto">
      <!--   ===================== Start Text Content ======================    -->
      <div class="text-content text-center md:w-4/5 mx-auto mb-5">
        <p class="font-bold text-xl text-text">{{ t(subTitle) }}</p>
        <h3 class="font-bold text-4xl text-primary my-3">{{ t(title) }}</h3>
        <p>{{ t(description) }}</p>
      </div>
      <!--   ===================== End Text Content ======================    -->
      <!--   ===================== Start Clients Carousel ======================    -->
      <div class="clients-carousel flex items-center">
        <div>
          <component
            :is="LeftArrow"
            class="text-4xl text-gray-400 transition duration-300 hover:text-text hover:scale-150"
          ></component>
        </div>
        <div class="swiper-wrapper grow w-4/5 overflow-hidden">
          <div class="flex flex-nowrap items-center justify-center gap-10">
            <div
              v-for="(client, index) in clients"
              :key="index"
              class="swiper-item w-40 h-40 p-3 rounded-full overflow-hidden flex items-center justify-center transition duration-300 hover:shadow-lg my-5"
              style="flex: 1 0 10rem"
            >
              <img
                :src="client.image"
                :alt="client.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div>
          <component
            :is="RightArrow"
            class="text-4xl text-gray-400 transition duration-300 hover:text-text hover:scale-150"
          ></component>
        </div>
      </div>
      <!--   ===================== End Clients Carousel ======================    -->
    </div>
  </div>
</template>

<script lang="ts">
import RightArrow from '#icons/solid/angle-right.svg';
import LeftArrow from '#icons/solid/angle-left.svg';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'our-clients-section',
  setup() {
    const i18n = useI18n();
    const clients = [
      {
        id: 1,
        title: 'Madrasha',
        image: '/assets/images/client-1.jpg',
      },
      {
        id: 2,
        title: 'Madrasha',
        image: '/assets/images/client-2.png',
      },
      {
        id: 3,
        title: 'Madrasha',
        image: '/assets/images/client-1.jpg',
      },
      {
        id: 4,
        title: 'Madrasha',
        image: '/assets/images/client-2.png',
      },
      {
        id: 5,
        title: 'Madrasha',
        image: '/assets/images/client-1.jpg',
      },
      {
        id: 6,
        title: 'Madrasha',
        image: '/assets/images/client-2.png',
      },
      {
        id: 7,
        title: 'Madrasha',
        image: '/assets/images/client-1.jpg',
      },
      {
        id: 8,
        title: 'Madrasha',
        image: '/assets/images/client-2.png',
      },
    ];
    return {
      description: "homePage['our-clients-section']['description']",
      subTitle: "homePage['our-clients-section']['sub-title']",
      title: "homePage['our-clients-section']['title']",
      RightArrow,
      LeftArrow,
      t: i18n.t,
      clients,
    };
  },
});
</script>
