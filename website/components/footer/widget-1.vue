<template>
  <div class="logo mb-5">
    <img :src="LogoWhite" alt="Logo" />
  </div>
  <p class="mb-5 text-justify text-gray-400 text-sm">
    {{ t("footer['widget-1']['details']") }}
  </p>
  <ul class="flex items-center gap-3 text-2xl">
    <li>
      <a href="#">
        <Facebook />
      </a>
    </li>
    <li>
      <a href="#">
        <Twitter />
      </a>
    </li>
    <li>
      <a href="#">
        <Web />
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import LogoWhite from '#images/logo white.svg?url';
import Facebook from '#icons/brands/facebook.svg';
import Twitter from '#icons/brands/twitter.svg';
import Web from '#icons/solid/globe.svg';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'widget-1',
  components: {
    Facebook,
    Twitter,
    Web,
  },
  setup() {
    const i18n = useI18n();
    return {
      t: i18n.t,
      LogoWhite,
    };
  },
});
</script>
