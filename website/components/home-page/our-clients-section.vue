<template>
  <div class="our-clients-section my-20 text-text dark:text-light">
    <div class="container mx-auto">
      <!--   ===================== Start Text Content ======================    -->
      <div class="text-content text-center md:w-4/5 mx-auto mb-5">
        <p class="font-bold text-xl">{{ t(subTitle) }}</p>
        <h3
          class="font-bold text-4xl lg:text-5xl text-primary dark:text-secondary my-3"
        >
          {{ t(title) }}
        </h3>
        <p>{{ t(description) }}</p>
      </div>
      <!--   ===================== End Text Content ======================    -->
      <!--   ===================== Start Clients Carousel ======================    -->
      <div class="clients-carousel flex items-center">
        <div @click="slider.prev()">
          <component
            :is="LeftArrow"
            class="text-4xl text-gray-400 transition duration-300 hover:text-text hover:scale-150"
          ></component>
        </div>
        <div class="swiper-wrapper grow w-4/5">
          <div class="clients">
            <div
              v-for="(client, index) in clients"
              :key="index"
              class="swiper-item p-3 flex items-center justify-center transition duration-300 my-5"
              style="
                flex: 1 0 10rem;
                width: calc(8rem + 2vw * (1 - 0.1));
                height: calc(8rem + 2vw * (1 - 0.1));
              "
            >
              <img
                :src="client.image"
                :alt="client.title"
                class="w-full h-full object-cover p-2 transition duration-300 grayscale hover:grayscale-0 opacity-75 hover:opacity-100"
              />
            </div>
          </div>
        </div>
        <div @click="slider.next">
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
import { defineComponent, onMounted } from 'vue';
import RightArrow from '#icons/solid/angle-right.svg';
import LeftArrow from '#icons/solid/angle-left.svg';
import Siema from 'siema';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'our-clients-section',
  mounted() {
    const slider = new Siema({
      selector: '.clients',
      duration: 200,
      easing: 'ease-out',
      perPage: {
        0: 2,
        768: 3,
        1024: 5,
      },
      startIndex: 0,
      draggable: true,
      multipleDrag: false,
      threshold: 20,
      loop: false,
      rtl: false,
    });
  },
  setup: function () {
    const i18n = useI18n();
    const clients = [
      {
        id: 1,
        title: 'Madrasha',
        image: '/resources/images/client-1.jpg',
      },
      {
        id: 2,
        title: 'Madrasha',
        image: '/resources/images/client-2.png',
      },
      {
        id: 3,
        title: 'Madrasha',
        image: '/resources/images/client-1.jpg',
      },
      {
        id: 4,
        title: 'Madrasha',
        image: '/resources/images/client-2.png',
      },
      {
        id: 5,
        title: 'Madrasha',
        image: '/resources/images/client-1.jpg',
      },
      {
        id: 6,
        title: 'Madrasha',
        image: '/resources/images/client-2.png',
      },
      {
        id: 7,
        title: 'Madrasha',
        image: '/resources/images/client-1.jpg',
      },
      {
        id: 8,
        title: 'Madrasha',
        image: '/resources/images/client-2.png',
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
