<template>
  <div class="form" v-if="loginStage === 'form'">
    <page-title :title="i18n.t('login.login')" />
    <h2 class="text-lg text-center text-gray-400">
      {{ i18n.t("login['sub-title']") }}
    </h2>
    <form @submit.prevent="handleSubmit">
      <div class="md:w-3/5 mx-auto flex flex-col gap-2 items-center p-5">
        <InputField
          :placeholder="i18n.t('login[\'code-l\']')"
          @on-keypress="validate"
          @on-input="handleInput"
          :value="values.code"
          :error="errors.code"
          @on-blur="validate"
          name="code"
          type="text"
        />
        <InputField
          :placeholder="i18n.t('login[\'username-l\']')"
          :value="values.username"
          :error="errors.username"
          @on-input="handleInput"
          @on-keypress="validate"
          @on-blur="validate"
          name="username"
          type="text"
        />
        <InputField
          @on-toggle-password="showPassword = !showPassword"
          :type="showPassword ? 'text' : 'password'"
          :show-password="showPassword"
          :value="values.password"
          :error="errors.password"
          :isPasswordField="true"
          @on-input="handleInput"
          :placeholder="i18n.t('login.password')"
          @on-blur="validate"
          name="password"
        />
        <div class="w-full">
          <input
            v-model="values.remember"
            type="checkbox"
            name="remember"
            id="remember"
          />
          <label
            class="text-text dark:text-light font-bold ml-2"
            for="remember"
          >
            {{ i18n.t("login['remember-me']") }}
          </label>
        </div>
        <br />
        <button
          type="submit"
          :value="btnText"
          class="px-5 py-2 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
        >
          {{ btnText }}
        </button>
      </div>
    </form>
    <p class="text-center italic">
      {{ i18n.t("login['no-account']") }}
      <a href="/signup" class="font-bold text-primary dark:text-secondary">{{
        i18n.t('login.signup')
      }}</a>
    </p>
    <p class="text-center italic">
      <a
        href="/password-reset"
        class="font-bold text-primary dark:text-secondary"
        >{{ i18n.t("login['forgot-password']") }}</a
      >
    </p>
  </div>
  <div class="loading" v-else-if="loginStage === 'loading'">
    <p>Loading...</p>
  </div>
  <div class="success" v-else>
    <p>Success</p>
  </div>
</template>

<script lang="ts" setup>
import InputField from '#components/form-components/input-field.vue';
import PageTitle from '#components/ui/page-title.vue';
import loginFormType from '#types/login-form-type';
import { useAuth } from '#stores/auth.store';
import { inject, reactive, ref } from 'vue';
import * as Yup from 'yup';
import { useI18n } from 'vue-i18n';

// Toast
const toast: any = inject('$toast');

const i18n = useI18n();

defineProps(['search', 'category', 'categories']);
defineEmits(['update:search', 'update:category']);

const loginStage = ref('form');
const btnText = ref('Login');
const showPassword = ref(false);

const values = reactive<loginFormType>({
  code: '',
  username: '',
  password: '',
  rememberMe: false,
});
const errors = reactive<Omit<loginFormType, 'rememberMe'>>({
  code: '',
  username: '',
  password: '',
});

const schema = Yup.object().shape({
  code: Yup.string().required('Institute Code is required'),
  username: Yup.string().required('Username is required'),
  rememberMe: Yup.boolean().optional().default(false),
});

const authStore = useAuth();

const validate = (field: keyof Omit<loginFormType, 'rememberMe'>) => {
  schema
    .validateAt(field, values)
    .then(() => {
      errors[field] = '';
    })
    .catch((err) => {
      errors[field] = err.message;
    });
};

const handleInput = (event: any) => {
  if (!event.target?.name) {
    return;
  }

  (values as any)[event.target.name] = event.target.value;
};

const handleSubmit = async () => {
  const user = await authStore.login(values);

  if (user?.id) {
    toast.success('Logged In successfully!');
    location.replace('/');
  } else {
    toast.error('Something went wrong!');
  }

  // TODO: Show success/error message
};
</script>
