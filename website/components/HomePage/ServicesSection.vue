<template>
  <div>
    <div class="container mx-auto flex justify-between items-center gap-5">
      <div class="text flex-1">
        <p class="text__subtitle font-bold text-text">SAHARA IT</p>
        <h3 class="text__heading text-5xl font-bold text-primary my-5">
          We Offering The Best<br />
          Services For You
        </h3>
        <p class="text__para text-text text-sm mb-5">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
        <secondary-btn title="SEE ALL SERVICES" />
      </div>
      <div class="info-boxes flex-1 flex flex-wrap gap-3 py-20">
        <!-- ================= start Item =============== -->
        <div
          class="info-box__item w-1/2 rounded-xl border border-primary px-5 pt-[60px] pb-[30px] text-center relative"
        >
          <div
            class="info-box__icon w-[100px] h-[100px] rounded-full p-5 border bg-white border-primary absolute -top-[50px] left-1/2 -translate-x-1/2"
          >
            <img src="/assets/images/quran.svg" alt="blog" />
          </div>
          <div class="info-box__content">
            <h3 class="info-box__title text-xl font-bold mb-2 text-primary">
              Computerized Accounting
            </h3>
            <p class="info-box__para text-sm text-text text-justify">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <primary-btn
            class="absolute -bottom-[20px] left-1/2 -translate-x-1/2"
            title="Read More"
            :icon="ArrowAltRight"
            endIcon
          />
        </div>
        <!--- end Item --->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PrimaryBtnVue from '#components/ui/btn/PrimaryBtn.vue';
import SecondaryBtnVue from '#components/ui/btn/SecondaryBtn.vue';
import ArrowAltRight from '#icons/solid/arrow-right.svg';
export default {
  name: 'services-section',
  components: {
    'secondary-btn': SecondaryBtnVue,
    'primary-btn': PrimaryBtnVue,
  },
  setup() {
    return {
      ArrowAltRight,
    };
  },
};
</script>
