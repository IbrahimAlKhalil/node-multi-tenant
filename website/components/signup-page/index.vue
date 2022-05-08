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
        <form
          @submit.prevent="handleEmailSubmit"
          v-show="selectedTab === 'email'"
        >
          <div class="w-1/2 mx-auto flex flex-col gap-8 items-center p-5 my-10">
            <InputField
              name="username"
              type="text"
              placeholder="Enter your email"
              v-model="values.username"
              :error="errors.username"
              :value="values.username"
              @on-input="handleEmailInput"
              @on-focus="validateEmail"
              @on-keypress="validateEmail"
            />
            <input
              type="submit"
              :value="btnText"
              class="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
            />
          </div>
        </form>
        <form
          @submit.prevent="handleCompanySubmit"
          v-show="selectedTab === 'company'"
        >
          <div class="w-1/2 mx-auto flex flex-col items-center gap-8 p-5 my-10">
            <SelectInput
              label="Languages"
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
            />
            <SelectInput
              label="Default Language"
              name="defaultLanguage"
              :options="companyInfo.languages"
              :selected-items="companyInfo.defaultLanguage"
              @on-select="handleSingleSelect"
              :is-single-select="true"
            />
            <InputField
              name="instituteName"
              type="text"
              placeholder="Enter your company name"
              v-model="companyInfo.instituteName"
              :error="errors.instituteName"
              :value="companyInfo.instituteName"
              @on-input="handleInput"
              @on-focus="validate"
              @on-keypress="validate"
            />
            <InputField
              name="userName"
              type="text"
              placeholder="Enter your username"
              v-model="companyInfo.userName"
              :error="errors.userName"
              :value="companyInfo.userName"
              @on-input="handleInput"
              @on-focus="validate"
              @on-keypress="validate"
            />
            <InputField
              name="mobileNo"
              type="text"
              placeholder="Enter your mobile number"
              v-model="companyInfo.mobileNo"
              :error="errors.mobileNo"
              :value="companyInfo.mobileNo"
              @on-input="handleInput"
              @on-focus="validate"
              @on-keypress="validate"
            />
            <InputField
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              v-model="companyInfo.password"
              :error="errors.password"
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
              placeholder="Confirm your password"
              v-model="companyInfo.confirmPassword"
              :error="errors.confirmPassword"
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
              placeholder="Enter your verification code"
              v-model="companyInfo.verificationCode"
              :error="errors.verificationCode"
              :value="companyInfo.verificationCode"
              @on-input="handleInput"
              @on-focus="validate"
              @on-keypress="validate"
            />
            <input
              type="submit"
              value="Update"
              class="px-5 py-2 bg-secondary hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
            />
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
import InputField from '#components/form-components/input-field.vue';
import SelectInput from '#components/form-components/select-input.vue';
import * as Yup from 'yup';
import { ref } from 'vue';

defineProps(['search', 'category', 'categories']);

defineEmits(['update:search', 'update:category']);

// states
const showPassword = ref(false);
const btnText = ref('Signup');
const selectedTab = ref('company');
const values = ref({
  username: '',
});
const errors = ref({
  username: '',
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
  username: Yup.string()
    .required('Username is required')
    .email('Invalid email'),
});

const companySchema = Yup.object().shape({
  languages: Yup.array().required('Languages are required'),
  defaultLanguage: Yup.array().required('Default language is required'),
  instituteName: Yup.string().required('Institute name is required'),
  userName: Yup.string().required('User name is required'),
  mobileNo: Yup.string().required('Mobile number is required'),
  password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string().required('Confirm password is required'),
  verificationCode: Yup.string().required('Verification code is required'),
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
    .validateAt(field, values.value)
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
      console.log(values.value);
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
