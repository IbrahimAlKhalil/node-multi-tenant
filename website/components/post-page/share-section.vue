<!-- // https://share-button-links.netlify.app/buttons#twitter -->
<template>
  <section class="py-8">
    <div class="container flex justify-center items-center gap-5">
      <h5 class="font-bold text-xl text-text dark:text-light">শেয়ার করুন</h5>
      <ul class="flex items-center gap-3 text-2xl">
        <li>
          <a
            :href="facebookShare"
            target="_blank"
            class="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark dark:bg-secondary hover:dark:bg-secondary-dark text-light flex justify-center items-center cursor-pointer transition"
          >
            <Facebook style="bottom: 0" />
          </a>
        </li>
        <li>
          <a
            :href="twitterShare"
            target="_blank"
            class="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark dark:bg-secondary hover:dark:bg-secondary-dark text-light flex justify-center items-center cursor-pointer transition"
          >
            <Twitter style="bottom: 0" />
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Facebook from '#icons/brands/facebook-f.svg';
import Twitter from '#icons/brands/twitter.svg';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-share-section',
  components: { Facebook, Twitter },
  props: {
    title: {
      type: String,
      required: true,
    },
    shortDetails: {
      type: String,
      default: '',
    },
    quote: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentUrl: '',
    };
  },
  mounted() {
    this.currentUrl = location.href;
  },
  computed: {
    facebookShare() {
      const url = new URL('https://www.facebook.com/sharer/sharer.php');
      url.searchParams.set('u', this.currentUrl);
      url.searchParams.set('t', this.title);
      url.searchParams.set('quote', this.quote);
      return url;
    },
    twitterShare() {
      const url = new URL('https://twitter.com/intent/tweet/');
      url.searchParams.set('title', this.title);
      url.searchParams.set('text', this.shortDetails + '...');
      url.searchParams.set('url', this.currentUrl);
      return url;
    },
  },
  setup() {
    return {};
  },
});
</script>
