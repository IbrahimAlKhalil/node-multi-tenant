<template>
  <div class="bg-light py-16">
    <div class="container mx-auto">
      <div class="text-content text-center w-1/2 mx-auto mb-10">
        <p class="sub-heading font-bold text-text">SAHARA IT</p>
        <h3 class="heading text-5xl font-bold text-primary my-5">
          We offering some awesome plans for you
        </h3>
        <p class="text-sm text-text">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <div class="tables flex justify-evenly">
        <!--      ==================== Table Start ========================= -->
        <div
          v-for="item in pricingData"
          :key="item.id"
          class="tables__table border-t-4 border-secondary bg-white px-8 py-5 text-xl rounded-b-lg"
          :class="{ 'border-primary shadow-xl': item.isFeatured }"
        >
          <h3
            class="font-bold text-2xl text-center mt-5 mb-8 leading-10 text-text uppercase"
          >
            {{ item.title }}
            <span
              class="block text-5xl"
              :class="{
                'text-primary': item.isFeatured,
                'text-secondary': !item.isFeatured,
              }"
              >{{ item.price
              }}<span class="text-lg text-text lowercase">/month</span></span
            >
          </h3>
          <ul class="mb-8">
            <li
              v-for="feature in item.features"
              :key="feature.id"
              class="flex items-center gap-1 mb-3"
            >
              <component
                :is="Check"
                class="text-xl"
                :class="{
                  'text-secondary': feature.active && !item.isFeatured,
                  'text-gray-400': !feature.active,
                  'text-primary': item.isFeatured,
                }"
              ></component>
              <span
                class="text-gray-400"
                :class="{ 'text-text': feature.active }"
              >
                {{ feature.name }}
              </span>
            </li>
          </ul>
          <secondary-btn v-if="!item.isFeatured" title="Choose The Plan" />
          <primary-btn v-if="item.isFeatured" title="Choose The Plan" />
        </div>
        <!--  Table End  -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SecondaryBtn from '#components/ui/btn/SecondaryBtn.vue';
import PrimaryBtn from '#components/ui/btn/PrimaryBtn.vue';
import Check from '#icons/solid/check-circle.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PricingSection.vue',
  components: {
    'secondary-btn': SecondaryBtn,
    'primary-btn': PrimaryBtn,
  },
  setup() {
    return {
      pricingData: [
        {
          id: 1,
          title: 'Basic',
          price: '৳ 1000',
          isFeatured: false,
          features: [
            { id: 1, name: 'This is the Option', active: true },
            { id: 2, name: 'This is the Option', active: true },
            { id: 3, name: 'This is the Option', active: false },
            { id: 4, name: 'This is the Option', active: false },
            { id: 5, name: 'This is the Option', active: false },
          ],
          button: {
            title: 'Choose The Plan',
            link: '#',
          },
        },
        {
          id: 2,
          title: 'Standard',
          price: '৳ 2000',
          isFeatured: true,
          features: [
            { id: 1, name: 'This is the Option', active: true },
            { id: 2, name: 'This is the Option', active: true },
            { id: 3, name: 'This is the Option', active: true },
            { id: 4, name: 'This is the Option', active: true },
            { id: 5, name: 'This is the Option', active: false },
          ],
          button: {
            title: 'Choose The Plan',
            link: '#',
          },
        },
        {
          id: 3,
          title: 'Premium',
          price: '৳ 3000',
          isFeatured: false,
          features: [
            { id: 1, name: 'This is the Option', active: true },
            { id: 2, name: 'This is the Option', active: true },
            { id: 3, name: 'This is the Option', active: true },
            { id: 4, name: 'This is the Option', active: true },
            { id: 5, name: 'This is the Option', active: true },
          ],
          button: {
            title: 'Choose The Plan',
            link: '#',
          },
        },
      ],
      Check,
    };
  },
});
</script>

<style scoped></style>
