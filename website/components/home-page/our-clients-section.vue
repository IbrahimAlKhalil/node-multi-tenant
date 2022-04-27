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
        <div @click="print">
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
              class="swiper-item p-3 rounded-full overflow-hidden flex items-center justify-center transition duration-300 hover:shadow-lg my-5"
              style="
                flex: 1 0 10rem;
                width: calc(8rem + 2vw * (1 - 0.1));
                height: calc(8rem + 2vw * (1 - 0.1));
              "
            >
              <img
                :src="client.image"
                :alt="client.title"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div @click="next">
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
import { defineComponent, onMounted, watch } from 'vue';
import RightArrow from '#icons/solid/angle-right.svg';
import LeftArrow from '#icons/solid/angle-left.svg';
import { useStyleStore } from '#stores/style.store';
import Siema from 'siema';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'our-clients-section',

  setup: function () {
    const i18n = useI18n();
    const styles = useStyleStore();
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

    let slider: Siema;

    const renderSlider = (value: typeof styles.breakpoints) => {
      slider = new Siema({
        selector: '.clients',
        duration: 200,
        easing: 'ease-out',
        perPage: value['md-and-down'] && !value['lg-and-up'] ? 3 : 5,
        startIndex: 0,
        draggable: true,
        multipleDrag: false,
        threshold: 20,
        loop: true,
        rtl: false,
      });
    };

    onMounted(() => {
      renderSlider(styles.breakpoints);
    });

    watch(
      styles.breakpoints,
      (value) => {
        slider.destroy(true, () => {
          renderSlider(value);
        });
      },
      {
        deep: true,
      },
    );

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
