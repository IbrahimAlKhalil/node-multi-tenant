<template>
  <div>
    <div class="container mx-auto flex justify-between items-center gap-20">
      <div class="text" style='flex: 1 1 40%'>
        <p class="text__subtitle font-bold text-text">SAHARA IT</p>
        <h3 class="text__heading text-5xl leading-[4rem] font-bold text-primary my-5">
          We Offering The Best Services For You
        </h3>
        <p class="text__para text-text text-sm text-justify mb-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <secondary-btn title="SEE ALL SERVICES" />
      </div>
      <ul class="info-boxes grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-x-10 gap-y-24 py-20" style='flex: 1 1 60%'>
        <!-- ================= start Item =============== -->
        <li
          v-for="item in items"
          :key="item.id"
          class="info-box__item rounded-xl border border-primary px-5 pt-[60px] pb-[30px] text-center relative"
        >
          <div
            class="info-box__icon w-[100px] h-[100px] rounded-full p-5 border bg-white border-primary absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img src="/assets/images/quran.svg" alt="blog" />
          </div>
          <div class="info-box__content">
            <h3 class="info-box__title text-xl font-bold mb-2 text-primary ">
              {{ item.title }}
            </h3>
            <p class="info-box__para text-sm text-text text-justify">
              {{ item.description }}
            </p>
          </div>
          <primary-btn
            class="w-2/3 justify-center absolute -bottom-[20px] left-1/2 -translate-x-1/2"
            title="Read More"
            :icon="item.icon"
            endIcon
          />
        </li>
        <!--- end Item --->
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import PrimaryBtnVue from '#components/ui/btn/PrimaryBtn.vue';
import SecondaryBtnVue from '#components/ui/btn/SecondaryBtn.vue';
import ArrowRight from '#icons/solid/arrow-right.svg';
export default {
  name: 'services-section',
  components: {
    'secondary-btn': SecondaryBtnVue,
    'primary-btn': PrimaryBtnVue,
  },
  setup() {
    return {
      items: [
        {
          id: '1',
          title: 'Computerized Accounting',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting\n' +
            '              industry. Lorem Ipsum has been the industry\'s standard dummy text\n' +
            '              ever since the 1500s, when an unknown printer took a galley of\n' +
            '              type and scrambled it to make a type specimen book.',
          icon: ArrowRight
        },
        {
          id: '1',
          title: 'Computerized Accounting',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting\n' +
            '              industry. Lorem Ipsum has been the industry\'s standard dummy text\n' +
            '              ever since the 1500s, when an unknown printer took a galley of\n' +
            '              type and scrambled it to make a type specimen book.',
          icon: ArrowRight
        },
        {
          id: '1',
          title: 'Computerized Accounting',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting\n' +
            '              industry. Lorem Ipsum has been the industry\'s standard dummy text\n' +
            '              ever since the 1500s, when an unknown printer took a galley of\n' +
            '              type and scrambled it to make a type specimen book.',
          icon: ArrowRight
        },
        {
          id: '1',
          title: 'Computerized Accounting',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting\n' +
            '              industry. Lorem Ipsum has been the industry\'s standard dummy text\n' +
            '              ever since the 1500s, when an unknown printer took a galley of\n' +
            '              type and scrambled it to make a type specimen book.',
          icon: ArrowRight
        },
      ],
    };
  },
};
</script>
