<template>
  <div class="key-features text-text dark:text-light">
    <div class="container mx-auto py-20 text-center flex flex-col items-center">
      <!--   ============== Start Text Content =================   -->
      <div class="md:w-4/5 mb-10">
        <p class="font-bold text-xl">{{ t(subTitle) }}</p>
        <SectionTitle>
          {{ t(title) }}
        </SectionTitle>
        <p>{{ t(description) }}</p>
      </div>
      <!--  End  Text Content   -->

      <!--   ============== Start Media =================   -->
      <img
        :src="KeyFeaturesImage"
        :alt="t(title)"
        width="75%"
        data-aos="flip-left"
      />
      <!--  End  Media   -->
    </div>
  </div>
</template>

<script lang="ts">
import KeyFeaturesImage from '#images/key-features.svg?url';
import SectionTitle from '#components/ui/section-title.vue';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'features-section',
  components: {
    SectionTitle,
  },
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
