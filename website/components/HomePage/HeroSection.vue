<template>
  <div class="hero-section relative">
    <div
      class="container mx-auto flex items-center justify-center gap-5 min-h-screen"
    >
      <div class="content flex-1 text-white">
        <h1 class="text-5xl leading-[4rem] font-bold text-inherit mb-5">
          {{ t(title) }}
        </h1>
        <p class="text-lg text-inherit mb-5">
          {{ t('homePage.hero-description') }}
        </p>
        <div class="flex gap-3">
          <primary-btn
            :title="t('homePage.hero-btn-primary')"
            :icon="DoorOpen"
          />
          <secondary-btn
            :title="t('homePage.hero-btn-primary')"
            :icon="PhonePlus"
          />
        </div>
      </div>
      <div class="media flex-1 w-full h-full flex justify-center items-center">
        <img :src="VideoImage" :alt="t('homePage.hero-image-alt')" />
      </div>
    </div>
    <div
      class="flex justify-center items-center shadow-md absolute bottom-12 left-1/2 -translate-x-1/2"
    >
      <component
        class="text-5xl text-white transition hover:scale-125 hover:text-secondary cursor-pointer"
        :is="Down"
      />
    </div>
    <feature-section />
  </div>
</template>

<script lang="ts">
import FeaturesSection from '#components/HomePage/FeaturesSection.vue';
import PrimaryBtnVue from '#components/ui/btn/PrimaryBtn.vue';
import SecondaryBtnVue from '#components/ui/btn/SecondaryBtn.vue';
import DoorOpen from '#icons/duotone/door-open.svg';
import PhonePlus from '#icons/duotone/phone-plus.svg';
import LoginWhite from '#icons/others/login-white.svg?url';
import Down from '#icons/solid/chevron-circle-down.svg';
import HeroBackground from '#images/HeroBackground.svg?url';
import VideoImage from '#images/Video.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  components: {
    'primary-btn': PrimaryBtnVue,
    'secondary-btn': SecondaryBtnVue,
    'feature-section': FeaturesSection,
  },
  data() {
    return {
      title: 'homePage.hero-title',
    };
  },
  setup() {
    const i18n = useI18n();
    return {
      t: i18n.t,
      LoginWhite,
      PhonePlus,
      DoorOpen,
      HeroBackground,
      VideoImage,
      Down,
    };
  },
});
</script>

<style scoped>
.hero-section {
  background: url('/assets/images/HeroBackground.svg') no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
