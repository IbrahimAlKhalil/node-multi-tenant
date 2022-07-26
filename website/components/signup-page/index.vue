<template>
  <page-title :title="t('login.signup')" />
  <h2 class="text-lg text-center text-gray-400">
    {{ t("login['signup-sub-title']") }}
  </h2>
  <form @submit.prevent="handleSubmit">
    <div class="md:w-3/5 mx-auto flex flex-col items-center gap-8 p-5 md:my-5">
      <InputField
        name="instituteName"
        type="text"
        :placeholder="t('login.institute')"
        v-model="model.instituteName"
        :error="errors.instituteName"
        :value="model.instituteName"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <InputField
        name="mobileNo"
        type="text"
        :placeholder="t('login.mobile')"
        v-model="model.mobileNo"
        :error="errors.mobileNo"
        :value="model.mobileNo"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <InputField
        name="email"
        type="text"
        :placeholder="t('login.email')"
        v-model="model.email"
        :error="errors.email"
        :value="model.email"
        @on-input="handleInput"
        @on-focus="validate"
        @on-keypress="validate"
      />
      <button
        type="submit"
        class="px-5 py-2 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary-dark text-white text-xl font-bold uppercase rounded-md"
      >
        {{ t('login.submit') }}
      </button>
    </div>
  </form>
  <p class="text-center italic">
    {{ t("login['have-account']") }}
    <br />
    <a href="/login" class="font-bold text-primary dark:text-secondary">{{
      t("login['login-here']")
    }}</a>
  </p>
</template>

<script lang="ts">
import InputField from '#components/form-components/input-field.vue';
import PageTitle from '#components/ui/page-title.vue';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import * as Yup from 'yup';

const schema = Yup.object().shape({
  instituteName: Yup.string().required('Institute name is required'),
  mobileNo: Yup.string().required('Mobile number is required'),
  email: Yup.string().required('Email is required').email('Invalid email'),
});

export default defineComponent({
  components: { PageTitle, InputField },
  data() {
    return {
      model: {
        instituteName: '',
        mobileNo: '',
        email: '',
      },
      errors: {
        instituteName: '',
        mobileNo: '',
        email: '',
      },
    };
  },
  methods: {
    handleInput(event: any) {
      if (!event.target?.name) {
        return;
      }

      (this.model as any)[event.target.name] = event.target.value;
    },
    validate(field: any) {
      schema
        .validateAt(field, this.model)
        .then(() => {
          (this as any).errors[field] = '';
        })
        .catch((err) => {
          (this as any).errors[field] = err.message;
        });
    },
    async handleSubmit() {
      const response = await fetch('/items/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          institute_name: this.model.instituteName,
          mobile: this.model.mobileNo,
          email: this.model.email,
        }),
      });

      if (response.status >= 200 && response.status <= 299) {
        this.$toast.success(
          'Registration successful, we will contact you soon, please stay tuned',
          {
            dismissible: true,
            duration: 1000 * 5,
          },
        );
      } else {
        this.$toast.error('Email or mobile is not available', {
          dismissible: true,
          duration: 1000 * 5,
        });
      }
    },
  },
  setup() {
    const i18n = useI18n();
    return {
      t: i18n.t,
    };
  },
});
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
