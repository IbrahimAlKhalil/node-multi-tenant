<template>
  <div class="">
    <div
      class="container mx-auto text-center rounded-lg shadow-2xl dark:bg-dark border-t border-gray-100 dark:border-black py-14 my-10"
    >
      <h3 class="font-bold text-4xl text-primary dark:text-secondary mb-3">
        {{ t(title) }}
      </h3>
      <p class="md:w-4/5 mx-auto text-gray-400 mb-5">{{ t(description) }}</p>
      <div class="news-letter-form">
        <div class="common input-area">
          <input
            type="text"
            placeholder="Enter email here"
            v-model="email"
            class="input"
          />
        </div>
        <div
          class="common submit-area flex items-center"
          @click="() => handleSubscribe(email)"
        >
          <input
            type="submit"
            value="Subscribe"
            class="input text-lg lg:text-2xl uppercase"
          />
          <PaperPlane class="text-xl lg:text-2xl px-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SubscriptionButton from '#images/subscription-button.svg?url';
import PaperPlane from '#icons/solid/paper-plane.svg';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'news-letter-section',
  components: { PaperPlane },
  data: () => ({
    email: '',
  }),
  methods: {
    async handleSubscribe(email: string) {
      const url = `/items/newsletter`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const result = await response.json();
      if (result?.data?.id) {
        this.$toast.success('Subscription successful!', {
          dismissible: true,
          duration: 1000 * 5,
        });
      } else {
        this.$toast.error('Email not valid or already exist!', {
          dismissible: true,
          duration: 1000 * 5,
        });
      }
    },
  },
  setup() {
    const i18n = useI18n();

    return {
      description: "homePage['news-letter-section']['description']",
      subTitle: "homePage['news-letter-section']['sub-title']",
      title: "homePage['news-letter-section']['title']",
      button: "homePage['news-letter-section']['button']",
      placeholder: "homePage['news-letter-section']['placeholder']",
      SubscriptionButton,
      t: i18n.t,
    };
  },
});
</script>

<style scoped>
.news-letter-form {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 75px;
}

.input {
  display: block;
  width: 100%;
  outline: none;
  border: none;
  height: 100%;
  background: none;
}
.common {
  border-top-width: 2px;
  border-bottom-width: 2px;
  border-color: var(--color-primary);
  border-style: solid;
  position: relative;
  padding: 0.5rem;
}
.input-area {
  border-left-width: 2px;
  border-radius: 0.5rem 0 0 0.5rem;
  min-width: 30%;
}
.submit-area {
  border-right-width: 2px;
  border-radius: 0 0.5rem 0.5rem 0;
  background: var(--color-primary);
  color: #fff;
  z-index: 2;
}

.common::after {
  content: '';
  display: block;
  width: 50px;
  height: 110%;
  border-bottom-width: 2px;
  border-top-width: 2px;
  border-style: solid;
  border-color: var(--color-primary);
  position: absolute;
  top: -2px;
  bottom: -2px;
}

.input-area::after {
  border-right-width: 2px;
  border-radius: 0 0.5rem 0.5rem 0;
  transform: skew(35deg) translateX(-20px);
  right: -50px;
}
.submit-area::after {
  height: 108%;
  border-left-width: 2px;
  border-radius: 0.5rem 0 0 0.5rem;
  transform: skew(35deg) translateX(20px);
  left: -50px;
  background: var(--color-primary);
  z-index: -1;
}
.common,
.common::after {
  transition: all 0.3s ease-in-out;
}

.submit-area:hover,
.submit-area:hover::after {
  cursor: pointer;
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}
</style>
