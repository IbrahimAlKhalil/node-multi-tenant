<template>
  <div class='logo mb-5'>
    <img src='/assets/images/logo white.svg' alt='Logo'>
  </div>
  <p class='mb-5 text-justify'>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without</p>
  <ul class='flex items-center gap-3 text-2xl'>
    <li><a href='#'>
      <component
        :is='Facebook'
      ></component>
    </a></li>
    <li><a href='#'>
      <component
        :is='Twitter'
      ></component>
    </a></li>
    <li><a href='#'>
      <component
        :is='Web'
      ></component>
    </a></li>
  </ul>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import PreFooter from '#components/Footer/PreFooter.vue';
import Facebook from '#icons/brands/facebook.svg';
import Twitter from '#icons/brands/twitter.svg';
import Web from '#icons/solid/globe.svg';


export default defineComponent({
  components: {
    'pre-footer': PreFooter
  },
  setup() {
    return {
      Facebook,
      Twitter,
      Web
    }
  }
})
</script>