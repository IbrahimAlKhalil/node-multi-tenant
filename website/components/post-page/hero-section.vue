<template>
  <section id="hero">
    <div class="w-9/12 mx-auto" style="padding-top: var(--header-height)">
      <div class="media my-10 relative">
        <div
          class="category h-10 absolute -bottom-5 left-1/2 -translate-x-1/2 bg-primary text-white text-xl font-bold p-2 rounded"
        >
          <h5>
            {{ categoryName }}
          </h5>
        </div>
        <img
          :src="'/assets/' + image"
          :alt="title"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import HeroImage from '#images/post-hero.png';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-hero-section',

  props: {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    categoryName: {
      type: String,
      default: '',
    },
  },

  setup() {
    return {
      HeroImage,
    };
  },
});
</script>

<style scoped>
#hero {
  background: linear-gradient(180deg, #fff5e1 0%, rgba(255, 255, 255, 0) 100%);
}
</style>
