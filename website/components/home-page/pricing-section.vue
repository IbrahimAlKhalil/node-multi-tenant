<template>
  <section
    id="pricing"
    class="bg-light dark:bg-dark text-text dark:text-light py-16"
  >
    <div class="container mx-auto">
      <div class="text-content text-center md:w-1/2 mx-auto mb-10">
        <p class="sub-heading font-bold">
          {{ t("homePage['pricing-section']['intro']['sub-title']") }}
        </p>
        <SectionTitle
          >{{ t("homePage['pricing-section']['intro']['title']") }}
        </SectionTitle>
        <p class="text-sm">
          {{ t("homePage['pricing-section']['intro']['description']") }}
        </p>
      </div>
      <div
        class="tables flex flex-col lg:flex-row justify-evenly gap-10 lg:gap-0"
      >
        <!--      ==================== Table Start ========================= -->
        <div
          v-for="(item, index) in pricingData"
          :key="item.id"
          class="tables__table border-t-4 border-secondary bg-white dark:bg-dark-light dark:text-white px-8 py-10 md:py-5 text-xl rounded-b-lg flex flex-col items-center text-text"
          :class="{ 'border-primary shadow-xl': item.isFeatured }"
          data-aos="fade-up"
          :data-aos-delay="100 * index"
        >
          <h3
            class="font-bold text-2xl text-center mt-5 mb-8 leading-10 uppercase"
          >
            {{ t(item.title) }}
            <span
              class="block text-5xl"
              :class="{
                'text-primary': item.isFeatured,
                'text-secondary': !item.isFeatured,
              }"
              >{{ t(item.price)
              }}<span class="text-lg text-text dark:text-gray-300 lowercase"
                >/{{
                  t("homePage['pricing-section']['basic']['price-time']")
                }}</span
              ></span
            >
          </h3>
          <ul class="mb-8">
            <li
              v-for="feature in item.features"
              :key="feature.id"
              class="flex items-center gap-1 mb-3"
            >
              <Check
                class="text-xl"
                :class="{
                  'text-secondary': feature.active && !item.isFeatured,
                  'text-gray-400': !feature.active,
                  'text-primary': item.isFeatured,
                }"
              />
              <span
                class="text-gray-400"
                :class="{ 'text-text': feature.active }"
              >
                {{ t(feature.name) }}
              </span>
            </li>
          </ul>
          <secondary-btn
            v-if="!item.isFeatured"
            :title="t(`homePage['pricing-section']['basic']['button']`)"
          />
          <primary-btn
            v-if="item.isFeatured"
            :title="t(`homePage['pricing-section']['basic']['button']`)"
          />
        </div>
        <!--  Table End  -->
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import SectionTitle from '#components/ui/section-title.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import Check from '#icons/solid/check-circle.svg';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'PricingSection.vue',
  components: {
    'secondary-btn': SecondaryBtn,
    'primary-btn': PrimaryBtn,
    SectionTitle,
    Check,
  },
  setup() {
    const i18n = useI18n();
    return {
      t: i18n.t,
      pricingData: [
        {
          id: 1,
          title: "homePage['pricing-section']['plans']['item-1']['name']",
          price: "homePage['pricing-section']['plans']['item-1']['price']",
          isFeatured: false,
          features: [
            {
              id: 1,
              name: "homePage['pricing-section']['plans']['item-1']['options']['option-1']",
              active: true,
            },
            {
              id: 2,
              name: "homePage['pricing-section']['plans']['item-1']['options']['option-2']",
              active: true,
            },
            {
              id: 3,
              name: "homePage['pricing-section']['plans']['item-1']['options']['option-3']",
              active: false,
            },
            {
              id: 4,
              name: "homePage['pricing-section']['plans']['item-1']['options']['option-4']",
              active: false,
            },
            {
              id: 5,
              name: "homePage['pricing-section']['plans']['item-1']['options']['option-5']",
              active: false,
            },
          ],
          button: {
            title: "homePage['pricing-section']['basic']['button']",
            link: '#',
          },
        },
        {
          id: 2,
          title: "homePage['pricing-section']['plans']['item-2']['name']",
          price: "homePage['pricing-section']['plans']['item-2']['price']",
          isFeatured: true,
          features: [
            {
              id: 1,
              name: "homePage['pricing-section']['plans']['item-2']['options']['option-1']",
              active: true,
            },
            {
              id: 2,
              name: "homePage['pricing-section']['plans']['item-2']['options']['option-2']",
              active: true,
            },
            {
              id: 3,
              name: "homePage['pricing-section']['plans']['item-2']['options']['option-3']",
              active: true,
            },
            {
              id: 4,
              name: "homePage['pricing-section']['plans']['item-2']['options']['option-4']",
              active: true,
            },
            {
              id: 5,
              name: "homePage['pricing-section']['plans']['item-2']['options']['option-5']",
              active: false,
            },
          ],
          button: {
            title: "homePage['pricing-section']['basic']['button']",
            link: '#',
          },
        },
        {
          id: 3,
          title: "homePage['pricing-section']['plans']['item-3']['name']",
          price: "homePage['pricing-section']['plans']['item-3']['price']",
          isFeatured: false,
          features: [
            {
              id: 1,
              name: "homePage['pricing-section']['plans']['item-3']['options']['option-1']",
              active: true,
            },
            {
              id: 2,
              name: "homePage['pricing-section']['plans']['item-3']['options']['option-2']",
              active: true,
            },
            {
              id: 3,
              name: "homePage['pricing-section']['plans']['item-3']['options']['option-3']",
              active: true,
            },
            {
              id: 4,
              name: "homePage['pricing-section']['plans']['item-3']['options']['option-4']",
              active: true,
            },
            {
              id: 5,
              name: "homePage['pricing-section']['plans']['item-3']['options']['option-5']",
              active: true,
            },
          ],
          button: {
            title: "homePage['pricing-section']['basic']['button']",
            link: '#',
          },
        },
      ],
    };
  },
});
</script>

<style scoped></style>
