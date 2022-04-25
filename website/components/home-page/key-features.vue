<template>
  <div class="key-features">
    <div class="container mx-auto my-20 text-center flex flex-col items-center">
      <!--   ============== Start Text Content =================   -->
      <div class="w-4/5 mb-10">
        <p class="font-bold text-xl text-text">{{ t(subTitle) }}</p>
        <h3 class="text-5xl leading-[1.5] font-bold text-primary my-3">
          {{ t(title) }}
        </h3>
        <p>{{ t(description) }}</p>
      </div>
      <!--  End  Text Content   -->

      <!--   ============== Start Media =================   -->
      <img :src="KeyFeaturesImage" :alt="t(title)" width="75%" />
      <!--  End  Media   -->
    </div>
  </div>
</template>

<script lang="ts">
import KeyFeaturesImage from '#images/key-features.svg?url';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'features-section',
  setup() {
    const i18n = useI18n();
    return {
      description: "homePage['key-features-section']['description']",
      subTitle: "homePage['key-features-section']['sub-title']",
      title: "homePage['key-features-section']['title']",
      KeyFeaturesImage,
      t: i18n.t,
    };
  },
});
</script>
