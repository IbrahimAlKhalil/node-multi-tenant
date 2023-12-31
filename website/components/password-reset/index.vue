<template>
  <page-title :title="i18n.t('passReset.reset')" />
  <h2 class="text-lg text-center text-gray-400 lowercase">
    {{ i18n.t("passReset['to-login']") }}
  </h2>
  <div
    class="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-20 py-5"
  >
    <div
      class="email font-bold cursor-pointer before:text-white"
      :class="[
        selectedTab === 'email'
          ? 'text-primary before:bg-primary dark:text-secondary dark:before:bg-secondary'
          : 'text-gray-500 before:bg-gray-500 dark:text-light dark:before:bg-light dark:before:text-text',
      ]"
    >
      <p>{{ i18n.t("passReset['send-code']") }}</p>
    </div>
    <div
      class="company font-bold cursor-pointer"
      :class="[
        selectedTab === 'company'
          ? 'text-primary before:bg-primary before:text-light dark:text-secondary dark:before:bg-secondary'
          : 'text-gray-500 before:bg-gray-500 before:text-light dark:text-light dark:before:bg-light dark:before:text-text',
      ]"
    >
      <p>{{ i18n.t('passReset.reset') }}</p>
    </div>
  </div>
  <form @submit.prevent="handleEmailSubmit" v-show="selectedTab === 'email'">
    <div class="md:w-1/2 mx-auto flex flex-col gap-5 items-center p-5 md:my-5">
      <InputField
        name="username"
        type="text"
        :placeholder="i18n.t('passReset[\'username-l\']')"
        v-model="values.username"
        :error="errors.username"
        :value="values.username"
        @on-input="handleEmailInput"
        @on-focus="validateEmail"
        @on-keypress="validateEmail"
      />
      <radio-field
        :title="i18n.t('passReset[\'verification-medium\']')"
        name="method"
        v-model="values.method"
        :error="errors.method"
        :value="values.method"
        @on-input="handleSelect"
        :options="[
          { name: 'email', label: i18n.t('passReset.email'), value: 'email' },
          { name: 'sms', label: i18n.t('passReset.sms'), value: 'sms' },
        ]"
      />
      <input
        type="submit"
        :value="i18n.t('passReset.send')"
        class="px-5 py-2 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
      />
    </div>
  </form>
  <form
    @submit.prevent="handleCompanySubmit"
    v-show="selectedTab === 'company'"
  >
    <div class="md:w-1/2 mx-auto flex flex-col items-center gap-8 p-5 my-10">
      <SelectInput
        :label="i18n.t('passReset.languages')"
        :options="[
          { label: 'বাংলা', value: 'bn' },
          { label: 'English', value: 'en' },
          { label: 'العربية', value: 'ar' },
          { label: 'اردو', value: 'ur' },
          { label: 'हिंदी', value: 'hi' },
        ]"
        :selected-items="companyInfo.languages"
        @on-select="handleSelect"
        @on-remove="handleRemove"
        :error="companyInfoErrors.languages"
        color="primary"
      />
      <SelectInput
        :label="i18n.t('passReset[\'default-lang\']')"
        name="defaultLanguage"
        :options="companyInfo.languages"
        :selected-items="companyInfo.defaultLanguage"
        @on-select="handleSingleSelect"
        :is-single-select="true"
        :error="companyInfoErrors.defaultLanguage"
        color="primary"
      />
      <InputField
        name="instituteName"
        type="text"
        :placeholder="i18n.t('passReset.institute')"
        v-model="companyInfo.instituteName"
        :error="companyInfoErrors.instituteName"
        :value="companyInfo.instituteName"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <InputField
        name="userName"
        type="text"
        :placeholder="i18n.t('passReset.username')"
        v-model="companyInfo.userName"
        :error="companyInfoErrors.userName"
        :value="companyInfo.userName"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <InputField
        name="mobileNo"
        type="text"
        :placeholder="i18n.t('passReset.mobile')"
        v-model="companyInfo.mobileNo"
        :error="companyInfoErrors.mobileNo"
        :value="companyInfo.mobileNo"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <InputField
        name="password"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="i18n.t('passReset.password')"
        v-model="companyInfo.password"
        :error="companyInfoErrors.password"
        :value="companyInfo.password"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
        :isPasswordField="true"
        :show-password="showPassword"
        @on-toggle-password="showPassword = !showPassword"
      />
      <InputField
        name="confirmPassword"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="i18n.t('passReset[\'confirm-pass\']')"
        v-model="companyInfo.confirmPassword"
        :error="companyInfoErrors.confirmPassword"
        :value="companyInfo.confirmPassword"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
        :isPasswordField="true"
        :show-password="showPassword"
        @on-toggle-password="showPassword = !showPassword"
      />
      <InputField
        name="verificationCode"
        type="text"
        :placeholder="i18n.t('passReset.code')"
        v-model="companyInfo.verificationCode"
        :error="companyInfoErrors.verificationCode"
        :value="companyInfo.verificationCode"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <input
        type="submit"
        :value="i18n.t('passReset.update')"
        class="px-5 py-2 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import SelectInput from '#components/form-components/select-input.vue';
import RadioField from '#components/form-components/radio-field.vue';
import InputField from '#components/form-components/input-field.vue';
import PageTitle from '#components/ui/page-title.vue';
import { useI18n } from 'vue-i18n';
import * as Yup from 'yup';
import { ref } from 'vue';

const i18n = useI18n();

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

// states
const showPassword = ref(false);
const btnText = ref('Send Code');
const selectedTab = ref('email');
const values = ref({
  username: '',
  method: 'sms',
});
const errors = ref({
  username: '',
  method: '',
});
const companyInfo = ref({
  languages: [],
  defaultLanguage: [],
  instituteName: '',
  userName: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
});
const companyInfoErrors = ref({
  languages: '',
  defaultLanguage: '',
  instituteName: '',
  userName: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
});

const schema = Yup.object().shape({
  username: Yup.string().required('Username, email or mobile no is required'),
  method: Yup.string(),
});

const companySchema = Yup.object().shape({
  languages: Yup.array().required('Languages are required'),
  defaultLanguage: Yup.array().required('Default language is required'),
  instituteName: Yup.string().required('Institute name is required'),
  userName: Yup.string().required('Username, email or mobile no is required'),
  mobileNo: Yup.string().required('Mobile number is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  verificationCode: Yup.string()
    .required('Verification code is required')
    .min(3, 'Verification code must be 4 digits'),
});

const handleEmailInput = (event) => {
  values.value[event.target.name] = event.target.value;
};

const handleInput = (event) => {
  companyInfo.value[event.target.name] = event.target.value;
};

const validateEmail = (field) => {
  schema
    .validateAt(field, values.value)
    .then(() => {
      errors.value[field] = '';
    })
    .catch((err) => {
      errors.value[field] = err.message;
    });
};
const validate = (field) => {
  companySchema
    .validateAt(field, companyInfo.value)
    .then(() => {
      companyInfoErrors.value[field] = '';
    })
    .catch((err) => {
      companyInfoErrors.value[field] = err.message;
    });
};

const handleSelect = (value) => {
  if (
    companyInfo.value.languages.findIndex(
      (item) => item.value === value.value,
    ) === -1
  ) {
    companyInfo.value.languages.push(value);
  } else {
    companyInfo.value.languages = companyInfo.value.languages.filter(
      (item) => item.value !== value.value,
    );
  }
};
const handleSingleSelect = (value) => {
  companyInfo.value.defaultLanguage = [value];
};

const handleRemove = (value) => {
  companyInfo.value.languages = companyInfo.value.languages.filter(
    (item) => item.value !== value,
  );
};

const handleEmailSubmit = () => {
  schema
    .validate(values.value, { abortEarly: false })
    .then(() => {
      errors.value = {};
      selectedTab.value = 'company';
    })
    .catch((err) => {
      err.inner.forEach((error) => {
        errors.value[error.path] = error.message;
      });
    });
};

const handleCompanySubmit = () => {
  console.log('company');
};
</script>

<style scoped>
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
