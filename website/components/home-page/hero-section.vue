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
          class="font-bold text-inherit mb-5 text-4xl lg:text-6xl leading-normal lg:leading-[1.7]"
        >
          {{ t('homePage.hero-title') }}
        </h1>
        <p class="text-xl text-inherit mb-5">
          {{ t('homePage.hero-description') }}
        </p>
        <div
          class="flex flex-col md:flex-row justify-center items-center lg:justify-start gap-3"
        >
          <a href="/login" v-if="!auth.user">
            <PrimaryBtn
              :title="t('homePage.hero-btn-primary')"
              :icon="DoorOpen"
            />
          </a>
          <a href="/app" v-else>
            <PrimaryBtn
              :title="t('common.go-to-dashboard')"
              :icon="TableColumns"
            />
          </a>
          <a href="/contact">
            <SecondaryBtn
              :title="t('homePage.hero-btn-secondary')"
              :icon="PhonePlus"
            />
          </a>
        </div>
      </div>
      <div
        class="media flex-1 -order-1 mt-12 lg:mt-0 lg:order-1 w-full h-full flex justify-center lg:justify-end items-center"
        data-aos="zoom-in"
        data-aos-delay="200"
        data-aos-duration="1000"
      >
        <img
          :src="VideoImage"
          :alt="t('homePage.hero-title')"
          class="w-3/4 md:w-3/5 lg:w-4/5"
        />
      </div>
    </div>
    <div
      class="flex justify-center items-center shadow-md absolute bottom-12 left-1/2 -translate-x-1/2 visible opacity-100 transition duration-500"
      :class="{ 'invisible opacity-0': isVisible }"
      @click="handleScroll"
    >
      <Down
        class="text-5xl text-white transition hover:scale-125 hover:text-secondary cursor-pointer"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import Down from '#icons/solid/chevron-circle-down.svg';
import TableColumns from '#icons/duotone/columns.svg';
import PhonePlus from '#icons/duotone/phone-plus.svg';
import DoorOpen from '#icons/duotone/door-open.svg';
import VideoImage from '#images/Video.svg?url';
import { useAuth } from '#stores/auth.store';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const auth = useAuth();
const t = i18n.t;

defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const handleScroll = () => {
  window.scrollTo({
    top: 350,
    behavior: 'smooth',
  });
};
</script>

<style scoped>
.hero-section {
  background: url('/resources/images/HeroBackground.svg') no-repeat center;
  background-size: cover;
}
</style>
