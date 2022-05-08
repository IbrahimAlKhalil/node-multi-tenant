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
        <form @submit.prevent="handleSubmit">
          <div class="w-1/2 mx-auto flex flex-col items-center p-5 my-10">
            <div class="w-full mb-5">
              <input
                type="text"
                name="username"
                v-model="values.username"
                class="block px-3 py-2 rounded-md text-white outline-0 border-b-2 border-white focus:border-primary w-full bg-transparent transition duration-300 ease-in placeholder-opacity-60"
                :class="{
                  'border-red-500 focus:border-red-500': errors.username,
                }"
                placeholder="Email"
                @focus="validate('username')"
                @keypress="validate('username')"
              />
              <p class="text-sm italic text-red-500 p-1">
                {{ errors?.username || '' }}
              </p>
            </div>
            <div class="w-full mb-5 relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="values.password"
                class="block px-3 py-2 rounded-md text-white outline-0 border-b-2 border-white focus:border-primary w-full bg-transparent transition duration-300 ease-in placeholder-opacity-60"
                :class="{
                  'border-red-500 focus:border-red-500': errors.password,
                }"
                placeholder="Password"
                @focus="validate('password')"
                @keypress="validate('password')"
              />
              <p class="text-sm italic text-red-500 p-1">
                {{ errors?.password || '' }}
              </p>
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <component
                  v-show="showPassword"
                  :is="EyeOpen"
                  class="text-2xl p-1 cursor-pointer"
                  @click="showPassword = !showPassword"
                ></component>
                <component
                  v-show="!showPassword"
                  :is="EyeClosed"
                  class="text-2xl p-1 cursor-pointer"
                  @click="showPassword = !showPassword"
                ></component>
              </div>
            </div>
            <div class="w-full mb-5">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                v-model="values.remember"
              />
              <label for="remember" class="text-white ml-2">Remember me</label>
            </div>
            <input
              type="submit"
              :value="btnText"
              class="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
            />
          </div>
        </form>
        <p class="text-center italic">
          Do not have account?
          <a href="/signup" class="font-bold text-secondary">Sign UP</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import EyeClosed from '#icons/solid/eye-slash.svg';
import EyeOpen from '#icons/solid/eye.svg';
import * as Yup from 'yup';
import { ref } from 'vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

const btnText = ref('Login');
const showPassword = ref(false);
const values = ref({
  username: '',
  password: '',
  remember: false,
});
const errors = ref({
  username: '',
  password: '',
});

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .email('Invalid email'),
  password: Yup.string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters'),
});

const validate = (field) => {
  schema
    .validateAt(field, values.value)
    .then(() => {
      errors.value[field] = '';
    })
    .catch((err) => {
      errors.value[field] = err.message;
    });
};

const handleSubmit = () => {
  schema
    .validate(values.value, { abortEarly: false })
    .then(() => {
      errors.value = {};
      console.log(values.value);
    })
    .catch((err) => {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    });
};
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
