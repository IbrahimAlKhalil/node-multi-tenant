<template>
  <div class="testimonial-section my-10 text-text dark:text-light">
    <div class="container mx-auto">
      <div class="intro text-center mb-8">
        <p class="font-bold">{{ t(textContent.subTitle) }}</p>
        <h3
          class="font-bold text-4xl lg:text-5xl text-primary dark:text-secondary my-3"
        >
          {{ t(textContent.title) }}
        </h3>
        <p class="md:w-4/5 mx-auto">
          {{ t(textContent.description) }}
        </p>
      </div>
      <div class="content-area flex items-center gap-5">
        <div class="prev-btn cursor-pointer" @click="slider.prev()">
          <LeftArrow
            class="text-2xl lg:text-4xl text-gray-400 transition duration-300 hover:text-text hover:scale-150"
          />
        </div>
        <div class="testimonial-slider testimonials">
          <div
            class="testimonials__slider-1 border-2 border-gray-200 dark:border-secondary dark:bg-dark rounded-lg p-4 flex flex-col lg:flex-row items-center gap-5 text-text dark:text-light"
            v-for="(testimonial, index) in testimonials"
            :key="index"
          >
            <div class="media" style="flex: 1 0 40%">
              <img
                src="https://via.placeholder.com/450x250"
                :alt="t(testimonial.company)"
                width="100%"
                class="object-cover rounded-lg"
              />
            </div>
            <div class="text text-center lg:text-left" style="flex: 2 1 60%">
              <h3
                class="font-bold text-xl lg:text-4xl text-primary dark:text-secondary mb-3"
              >
                {{ t(testimonial.company) }}
              </h3>
              <p class="text-sm lg:text-md">
                {{ t(testimonial.description) }}
              </p>
              <div class="flex items-center justify-between mt-4">
                <div class="author">
                  <h4 class="font-bold text-xl">
                    {{ t(testimonial.author) }}
                  </h4>
                  <p class="text-gray-500">
                    {{ t(testimonial.author_position) }}
                  </p>
                </div>
                <ul class="rating flex items-center gap-1">
                  <li v-for="n in 5" :key="n">
                    <StarRegular
                      v-show="testimonial.rating <= n"
                      class="text-secondary"
                    />
                    <StarSolid
                      v-show="testimonial.rating > n"
                      class="text-secondary"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="next-btn cursor-pointer" @click="slider.next()">
          <RightArrow
            class="text-2xl lg:text-4xl text-gray-400 transition duration-300 hover:text-text hover:scale-150"
          />
        </div>
      </div>
      <div class="handler my-5">
        <ul class="flex justify-center gap-1">
          <li
            v-for="(n, index) in slider?.innerElements?.length || 0"
            :key="n"
            class="w-4 h-4 rounded-full border border-primary"
            :class="{ 'bg-primary': index === slider?.currentSlide }"
            @click="slider.goTo(index)"
          ></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import RightArrow from '#icons/solid/angle-right.svg';
import LeftArrow from '#icons/solid/angle-left.svg';
import StarRegular from '#icons/regular/star.svg';
import StarSolid from '#icons/solid/star.svg';
import Icon from '#images/quran.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import Siema from 'siema';

export default defineComponent({
  name: 'testimonial-section',
  components: {
    StarRegular,
    RightArrow,
    LeftArrow,
    StarSolid,
  },
  data() {
    return {
      slider: {},
    };
  },
  //mounted
  mounted() {
    const slider = new Siema({
      selector: '.testimonials',
      duration: 200,
      easing: 'ease-out',
      perPage: 1,
      startIndex: 0,
      draggable: true,
      multipleDrag: false,
      threshold: 20,
      loop: true,
      rtl: false,
    });
    this.slider = slider;
  },
  setup() {
    const i18n = useI18n();
    const textContent = {
      title: "homePage['testimonial-section'].title",
      subTitle: "homePage['testimonial-section']['sub-title']",
      description: "homePage['testimonial-section'].description",
    };

    const items = [
      {
        id: 1,
        company:
          "homePage['testimonial-section']['items']['item-1']['company']",
        description:
          "homePage['testimonial-section']['items']['item-1']['description']",
        author: "homePage['testimonial-section']['items']['item-1']['author']",
        author_position:
          "homePage['testimonial-section']['items']['item-1']['author_position']",
        rating: 4,
      },
      {
        id: 2,
        company:
          "homePage['testimonial-section']['items']['item-2']['company']",
        description:
          "homePage['testimonial-section']['items']['item-2']['description']",
        author: "homePage['testimonial-section']['items']['item-2']['author']",
        author_position:
          "homePage['testimonial-section']['items']['item-2']['author_position']",
        rating: 5,
      },
      {
        id: 3,
        company:
          "homePage['testimonial-section']['items']['item-3']['company']",
        description:
          "homePage['testimonial-section']['items']['item-3']['description']",
        author: "homePage['testimonial-section']['items']['item-3']['author']",
        author_position:
          "homePage['testimonial-section']['items']['item-3']['author_position']",
        rating: 3,
      },
    ];

    return {
      testimonials: items,
      textContent,
      t: i18n.t,
      Icon,
    };
  },
});
</script>
