<template>
  <PageTitle title="We're here to support you!" />
  <form
    class="flex flex-col gap-4 w-4/5 mx-auto"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-col md:flex-row justify-between md:gap-10">
      <InputField
        placeholder="First Name"
        name="fName"
        type="text"
        v-model="values.fName"
        :value="values.fName"
        :error="errors.fName"
        @on-input="handleInput"
      />
      <InputField
        placeholder="Last Name"
        name="lName"
        type="text"
        v-model="values.lName"
        :value="values.lName"
        :error="errors.lName"
        @on-input="handleInput"
      />
    </div>
    <div class="flex flex-col md:flex-row justify-between md:gap-10">
      <InputField
        placeholder="Institute Name"
        name="companyName"
        type="text"
        v-model="values.companyName"
        :value="values.companyName"
        :error="errors.companyName"
        @on-input="handleInput"
      />
      <InputField
        placeholder="Email Address"
        name="emailAddress"
        type="text"
        v-model="values.emailAddress"
        :value="values.emailAddress"
        :error="errors.emailAddress"
        @on-input="handleInput"
      />
    </div>
    <TextAreaField
      label="Leave a message"
      name="message"
      v-model="values.message"
      :value="values.message"
      :error="errors.message"
      @on-input="handleInput"
    />
    <div>
      <primary-btn title="Send Message" />
    </div>
  </form>
</template>

<script lang="ts">
import TextAreaField from '#components/form-components/textarea-field.vue';
import InputField from '#components/form-components/input-field.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import PageTitle from '#components/ui/page-title.vue';
import { defineComponent, getCurrentInstance, reactive } from 'vue';
import * as Yup from 'yup';

export default defineComponent({
  name: 'hero-section',
  components: {
    TextAreaField,
    InputField,
    PrimaryBtn,
    PageTitle,
  },
  data() {
    return {
      values: {
        fName: '',
        lName: '',
        companyName: '',
        emailAddress: '',
        message: '',
      },
      errors: {
        fName: '',
        lName: '',
        companyName: '',
        emailAddress: '',
        message: '',
      },
      schema: Yup.object().shape({
        fName: Yup.string().required('First name is required'),
        lName: Yup.string(),
        companyName: Yup.string().required('Institute name is required'),
        emailAddress: Yup.string()
          .required('Email address required')
          .email('Invalid email address'),
        message: Yup.string().required('Message is required'),
      }),
    };
  },
  methods: {
    handleInput(event: Event) {
      this.values[event.target.name] = (event.target as HTMLInputElement).value;
    },
    validate() {
      for (let item in this.values) {
        this.schema
          .validateAt(item, this.values)
          .then(() => {
            this.errors[item] = '';
          })
          .catch((err) => {
            this.errors[item] = err.errors[0];
          });
      }
    },
    async handleSubmit() {
      await this.validate();
      const response = await fetch('/items/contact', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          first_name: this.values.fName,
          last_name: this.values.lName,
          institute_name: this.values.companyName,
          email: this.values.emailAddress,
          message: this.values.message,
        }),
      });
      const result = await response.json();
      if (result.errors) {
        this.$toast.error('Something went wrong!', {
          dismissible: true,
          duration: 1000 * 5,
        });
      } else {
        this.$toast.success('Email sent successful!', {
          dismissible: true,
          duration: 1000 * 5,
        });
        this.values = {
          fName: '',
          lName: '',
          companyName: '',
          emailAddress: '',
          message: '',
        };
      }
    },
  },
  setup() {
    return {};
  },
});
</script>
