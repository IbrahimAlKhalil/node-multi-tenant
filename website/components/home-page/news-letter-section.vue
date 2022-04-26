<template>
  <div class="my-10 bg-text text-white py-14">
    <div class="container mx-auto text-center">
      <h3 class="font-bold text-4xl mb-3">{{ t(title) }}</h3>
      <p class="md:w-4/5 mx-auto text-gray-400 mb-5">{{ t(description) }}</p>
      <form class="flex justify-center items-center w-1/2 mx-auto">
        <input
          type="text"
          :placeholder="t(placeholder)"
          class="block p-3 rounded-tl-lg rounded-bl-lg outline-0 focus:bg-amber-100 text-text"
          style="
            flex: 2 0 70%;
            clip-path: polygon(0 0, 90% 0, 100% 100%, 0 100%);
          "
        />
        <button
          class="bg-secondary text-white font-bold py-3 px-10 rounded-tr-lg rounded-br-lg -ml-6"
          style="
            flex: 1 0 auto;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 21% 100%);
          "
        >
          {{ t(button) }}
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'news-letter-section',
  setup() {
    const i18n = useI18n();

    return {
      description: "homePage['news-letter-section']['description']",
      subTitle: "homePage['news-letter-section']['sub-title']",
      title: "homePage['news-letter-section']['title']",
      button: "homePage['news-letter-section']['button']",
      placeholder: "homePage['news-letter-section']['placeholder']",
      t: i18n.t,
    };
  },
});
</script>
