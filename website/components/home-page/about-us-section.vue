<template>
  <section id="about" class="about-us-section">
    <div class="video-wrapper min-h-[70vh]">
      <video
        autoplay
        muted
        loop
        class="video w-full h-full object-cover scale-[3.7] sm:scale-[2.5]"
      >
        <source :src="backgroundVideo" type="video/mp4" />
      </video>
    </div>

    <div class="text-container py-2 md:py-10">
      <div
        class="info p-5 md:px-10 lg:p-14 bg-white/80 dark:bg-black/80 text-black dark:text-light w-11/12 lg:w-4/5 xl:w-1/2"
      >
        <p class="hidden md:visible font-bold text-md lg:text-lg">
          {{ i18n.t("homePage['about-us-section']['sub-title']") }}
        </p>
        <h2
          class="font-bold text-2xl md:text-3xl lg:text-5xl text-primary my-2 md:my-5"
        >
          {{ i18n.t("homePage['about-us-section']['title']") }}
        </h2>
        <p class="text-xs md:text-md lg:text-lg">
          {{ i18n.t("homePage['about-us-section']['description']") }}
        </p>
        <div
          class="actions flex flex-col md:flex-row justify-center items-center gap-2 md:gap-5 my-5 lg:my-10"
        >
          <primary-btn
            :title="i18n.t('homePage[\'about-us-section\'][\'primary-btn\']')"
            :icon="GiftIcon"
          />
          <a href="/contact">
            <secondary-btn
              :title="
                i18n.t('homePage[\'about-us-section\'][\'secondary-btn\']')
              "
              :icon="PhonePlus"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import PhonePlus from '#icons/duotone/phone-plus.svg';
import backgroundVideo from '#videos/background.mp4';
import GiftIcon from '#icons/solid/gift.svg';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
</script>

<style scoped>
.about-us-section {
  width: 100%;
  position: relative;
}
.video-wrapper {
  width: 100%;
  overflow: hidden;
}
.text-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.info {
  border-radius: 1rem;
  text-align: center;
  text-shadow: 0 0 1px;
}
</style>
