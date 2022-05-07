<template>
  <div
    class="hero-section lg:mb-24"
    style="
      margin-top: calc(-1 * var(--header-height));
      padding-top: var(--header-height);
    "
  >
    <div
      class="container flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-5 min-h-screen"
    >
      <div class="content flex-1 text-white text-center lg:text-left">
        <h1
          class="leading-[1.5] font-bold text-inherit mb-5"
          style="font-size: calc(2.5rem + 1.5vw)"
        >
          {{ t(title) }}
        </h1>
        <p class="text-2xl text-inherit mb-5">
          {{ t('homePage.hero-description') }}
        </p>
        <div class="flex justify-center lg:justify-start gap-3">
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
      <div
        class="media flex-1 -order-1 lg:order-1 w-full h-full flex justify-center lg:justify-end items-center"
        data-aos="zoom-in"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        <img
          :src="VideoImage"
          :alt="t('homePage.hero-image-alt')"
          class="w-3/5 lg:w-4/5"
        />
      </div>
    </div>
    <div
      class="flex justify-center items-center shadow-md absolute bottom-12 left-1/2 -translate-x-1/2 visible opacity-100 transition duration-500"
      :class="{ 'invisible opacity-0': isVisible }"
    >
      <component
        class="text-5xl text-white transition hover:scale-125 hover:text-secondary cursor-pointer"
        :is="Down"
      />
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtnVue from '#components/ui/btn/secondary-btn.vue';
import PrimaryBtnVue from '#components/ui/btn/primary-btn.vue';
import HeroBackground from '#images/HeroBackground.svg?url';
import LoginWhite from '#icons/others/login-white.svg?url';
import Down from '#icons/solid/chevron-circle-down.svg';
import PhonePlus from '#icons/duotone/phone-plus.svg';
import DoorOpen from '#icons/duotone/door-open.svg';
import VideoImage from '#images/Video.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  components: {
    'secondary-btn': SecondaryBtnVue,
    'primary-btn': PrimaryBtnVue,
  },
  data() {
    return {
      title: 'homePage.hero-title',
    };
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const i18n = useI18n();
    return {
      HeroBackground,
      VideoImage,
      LoginWhite,
      t: i18n.t,
      PhonePlus,
      DoorOpen,
      Down,
    };
  },
});
</script>

<style scoped>
.hero-section {
  background-size: cover;
  background: url('assets/images/HeroBackground.svg') no-repeat center center;
}
</style>
