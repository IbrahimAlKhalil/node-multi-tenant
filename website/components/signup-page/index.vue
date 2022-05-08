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
          Sign up
        </h1>
        <h2 class="text-lg lg:text-xl text-center">To access you dashboard</h2>
        <div class="flex items-center justify-center gap-20 py-5">
          <div
            class="email font-bold cursor-pointer"
            :class="[
              selectedTab === 'email'
                ? 'text-white before:bg-white'
                : 'text-gray-500 before:bg-gray-500',
            ]"
          >
            <p>Email</p>
          </div>
          <div
            class="company font-bold cursor-pointer"
            :class="[
              selectedTab === 'company'
                ? 'text-white before:bg-white'
                : 'text-gray-500 before:bg-gray-500',
            ]"
          >
            <p>Company Info</p>
          </div>
        </div>
        <form @submit.prevent="handleSubmit" v-show="selectedTab === 'email'">
          <div class="w-1/2 mx-auto flex flex-col items-center p-5 my-10">
            <InputFeild
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              v-model="values.username"
              :error="errors.username"
              :value="values.username"
              @on-input="handleInput"
              @on-focus="validate"
              @on-keypress="validate"
            />
            <input
              type="submit"
              :value="btnText"
              class="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
            />
          </div>
        </form>
        <form @submit.prevent="handleSubmit" v-show="selectedTab === 'company'">
          <div class="w-1/2 mx-auto flex flex-col items-center p-5 my-10">
            <div class="w-full mb-5"></div>
          </div>
        </form>
        <p class="text-center italic">
          Already have an account?
          <a href="/login" class="font-bold text-secondary">Login here</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import InputFeild from '#components/form-components/input-feild.vue';
import * as Yup from 'yup';
import { ref } from 'vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

const btnText = ref('Signup');
const selectedTab = ref('email');
const values = ref({
  username: '',
});
const errors = ref({
  username: '',
});

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .email('Invalid email'),
});

const handleInput = (value) => {
  values.value.username = value;
};

const validate = (field) => {
  console.log(field);
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
.email,
.company {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}
.email::before,
.company::before {
  content: '';
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: black;
  font-weight: 700;
  text-align: center;
}
.email::before {
  content: '1';
}
.company::before {
  content: '2';
}
</style>
