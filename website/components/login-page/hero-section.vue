<template>
  <page-title title="Login" />
  <h2 class="text-lg text-center text-gray-400 lowercase">
    To access you dashboard
  </h2>
  <form @submit.prevent="handleSubmit">
    <div class="w-1/2 mx-auto flex flex-col gap-2 items-center p-5">
      <InputField
        placeholder="Institute Code"
        name="code"
        type="text"
        v-model="values.code"
        :value="values.code"
        :error="errors.code"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
      <InputField
        placeholder="Email / Username / Mobile"
        name="username"
        type="text"
        v-model="values.username"
        :value="values.username"
        :error="errors.username"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
      <InputField
        placeholder="Password"
        name="password"
        :type="showPassword ? 'text' : 'password'"
        v-model="values.password"
        :value="values.password"
        :error="errors.password"
        :isPasswordField="true"
        :show-password="showPassword"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
        @on-toggle-password="showPassword = !showPassword"
      />
      <div class="w-full">
        <input
          type="checkbox"
          name="remember"
          id="remember"
          v-model="values.remember"
        />
        <label for="remember" class="text-text dark:text-light font-bold ml-2"
          >Remember me</label
        >
      </div>
      <input
        type="submit"
        :value="btnText"
        class="px-5 py-2 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
      />
    </div>
  </form>
  <p class="text-center italic">
    Do not have account?
    <a href="/signup" class="font-bold text-primary dark:text-secondary"
      >Sign UP</a
    >
  </p>
  <p class="text-center italic">
    <a href="/password-reset" class="font-bold text-primary dark:text-secondary"
      >Reset Password</a
    >
  </p>
</template>

<script lang="ts" setup>
import InputField from '#components/form-components/input-field.vue';
import PageTitle from '#components/ui/page-title.vue';
import * as Yup from 'yup';
import { ref } from 'vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

const btnText = ref('Login');
const showPassword = ref(false);
const values = ref<{
  code: string;
  username: string;
  password: string;
  remember: boolean;
}>({
  code: '',
  username: '',
  password: '',
  remember: false,
});

const errors = ref<{
  code: string;
  username: string;
  password: string;
}>({
  code: '',
  username: '',
  password: '',
});

const schema = Yup.object().shape({
  code: Yup.string().required('Institute Code is required'),
  username: Yup.string()
    .required('Username is required')
    .email('Invalid email'),
  password: Yup.string()
    .required('Password is required')
    .min(4, 'Password must be at least 4 characters'),
});

const validate = (field: string) => {
  schema
    .validateAt(field, values.value)
    .then(() => {
      errors.value[field] = '';
    })
    .catch((err) => {
      errors.value[field] = err.message;
    });
};

const handleInput = (event) => {
  values.value[event.target.name] = event.target.value;
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
