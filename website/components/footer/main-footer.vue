<template>
  <div class="footer bg-primary-dark text-white">
    <div class="container mx-auto flex justify-between gap-5 py-8">
      <div class="widget1 flex-1">
        <div class="logo mb-5">
          <img src="" alt="Logo" />
        </div>
        <p class="mb-5 text-justify">
          In publishing and graphic design, Lorem ipsum is a placeholder text
          commonly used to demonstrate the visual form of a document or a
          typeface without
        </p>
        <ul class="flex items-center gap-3 text-2xl">
          <li>
            <a href="#">
              <component :is="Facebook"></component>
            </a>
          </li>
          <li>
            <a href="#">
              <component :is="Twitter"></component>
            </a>
          </li>
          <li>
            <a href="#">
              <component :is="Web"></component>
            </a>
          </li>
        </ul>
      </div>
      <div class="widget2 flex-1"></div>
      <div class="widget3 flex-1"></div>
    </div>
    <pre-footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PreFooter from '#components/footer/pre-footer.vue';
import Facebook from '#icons/brands/facebook.svg';
import Twitter from '#icons/brands/twitter.svg';
import LogoWhite from '#images/logo white.svg';
import Web from '#icons/solid/globe.svg';

export default defineComponent({
  components: {
    'pre-footer': PreFooter,
  },
  setup() {
    return {
      year: new Date().getFullYear(),
      LogoWhite,
      Facebook,
      Twitter,
      Web,
    };
  },
});
</script>
