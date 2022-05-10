<template>
  <section id="about" class="about-us-section">
    <div class="video-wrapper">
      <video autoplay muted loop class="video">
        <source :src="backgroundVideo" type="video/mp4" />
      </video>
    </div>

    <div class="text-container py-10">
      <div class="info w-4/5 lg:w-1/2">
        <p class="font-bold text-md lg:text-lg">SAHARA IT</p>
        <h2 class="font-bold text-3xl lg:text-5xl text-secondary my-5">
          A short introduction about us
        </h2>
        <p class="text-gray-300 text-xs md:text-md lg:text-lg">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. Lorem Ipsum is simply dummy
          text of the printing and typesetting industry. Lorem
        </p>
        <div
          class="actions flex flex-col md:flex-row justify-center items-center gap-5 my-10"
        >
          <primary-btn title="VISIT SERVICES" :icon="GiftIcon" />
          <a href="/contact">
            <secondary-btn title="GET IN TOUCH" :icon="PhonePlus" />
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
import GiftIcon from '#icons/solid/gift.svg';
import backgroundVideo from '#videos/background.mp4';
</script>

<style scoped>
.about-us-section {
  width: 100%;
  position: relative;
}
.video-wrapper {
  width: 100%;
  min-height: 70vh;
  max-height: 80vh;
  overflow: hidden;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  background: rgba(0, 0, 0, 0.5);
}
.info {
  padding: 25px 50px 10px;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
}
</style>
