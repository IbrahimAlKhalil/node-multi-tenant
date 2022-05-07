<template>
  <div class="blog-hero min-h-screen flex justify-center items-center">
    <div
      class="container flex justify-center items-center h-full lg:mt-auto mb-[7vh]"
      style="margin-top: calc(var(--header-height) + 50px)"
    >
      <div
        class="backdrop w-full h-full px-8 py-14 rounded-xl text-white h-full"
      >
        <h1 class="font-bold text-3xl lg:text-5xl text-center uppercase mb-5">
          Login
        </h1>
        <h2 class="text-lg lg:text-xl text-center">To access you dashboard</h2>
        <form>
          <div class="w-1/2 mx-auto flex flex-col items-center p-5">
            <input
              type="text"
              class="block px-3 py-2 mb-5 rounded-md text-gray-500 outline-0 border-2 border-transparent focus:border-primary w-full"
              placeholder="Email"
            />
            <input
              type="password"
              class="block px-3 py-2 mb-5 rounded-md text-gray-500 outline-0 border-2 border-transparent focus:border-primary w-full"
              placeholder="Password"
            />
            <SecondaryBtn :title="btnText" />
          </div>
        </form>
        <p class="text-center italic">
          Do not have account?
          <a href="#" class="font-bold text-secondary">Sign UP</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

const btnText = ref('Login');
</script>

<style scoped>
.backdrop {
  background-color: rgba(0, 0, 0, 0.7);
  background-blend-mode: multiply;
}
.blog-hero {
  background: url('assets/images/HeroBackground.svg') no-repeat;
  background-size: cover;
  background-position: center;
}
</style>
