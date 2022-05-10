<template>
  <p class="font-bold tex-lg text-center uppercase">Shahara It</p>
  <h1 class="font-bold text-5xl text-center capitalize my-8">
    We're here to support you!
  </h1>
  <form class="flex flex-col gap-4 w-4/5 mx-auto">
    <div class="flex justify-between gap-10">
      <InputField
        placeholder="First Name"
        name="fName"
        type="text"
        v-model="values.fName"
        :value="values.fName"
        :error="errors.fName"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
      <InputField
        placeholder="Last Name"
        name="lName"
        type="text"
        v-model="values.lName"
        :value="values.lName"
        :error="errors.lName"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
    </div>
    <div class="flex justify-between gap-10">
      <InputField
        placeholder="Institute Name"
        name="companyName"
        type="text"
        v-model="values.companyName"
        :value="values.companyName"
        :error="errors.companyName"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
      <InputField
        placeholder="Email Address"
        name="emailAddress"
        type="text"
        v-model="values.emailAddress"
        :value="values.emailAddress"
        :error="errors.emailAddress"
        @on-input="handleInput"
        @on-blur="validate"
        @on-keypress="validate"
      />
    </div>
    <TextAreaField
      label="Leave a message"
      name="message"
      v-model="values.message"
      :value="values.message"
      :error="errors.message"
      @on-input="handleInput"
      @on-blur="validate"
      @on-keypress="validate"
    />
    <button type="submit">
      <secondary-btn title="Send Message" />
    </button>
  </form>
</template>

<script lang="ts" setup>
import TextAreaField from '#components/form-components/textarea-field.vue';
import InputField from '#components/form-components/input-field.vue';
import SecondaryBtn from '#components/ui/btn/secondary-btn.vue';
import * as Yup from 'yup';
import { ref } from 'vue';

const values = ref({
  fName: '',
  lName: '',
  companyName: '',
  emailAddress: '',
  message: '',
});
const errors = ref({
  fName: '',
  lName: '',
  companyName: '',
  emailAddress: '',
  message: '',
});

const schema = Yup.object().shape({
  fName: Yup.string().required('Required'),
  lName: Yup.string(),
  companyName: Yup.string(),
  emailAddress: Yup.string()
    .required('Email address required')
    .email('Invalid email address'),
  message: Yup.string().required('Required'),
});

const handleInput = (event: Event) => {
  values.value[event.target.name] = (event.target as HTMLInputElement).value;
};

const validate = (event: Event) => {
  schema
    .validateAt(event.target.name, values.value)
    .then(() => {
      errors.value[event.target.name] = '';
    })
    .catch((err) => {
      errors.value[event.target.name] = err.errors[0];
    });
};
</script>
