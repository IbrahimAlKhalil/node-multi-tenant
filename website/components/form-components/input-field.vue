<template>
  <div class="w-full relative">
    <label class="font-bold text-text dark:text-light" :for="name">
      {{ label }}
    </label>
    <input
      :type="type"
      :name="name"
      :value="value"
      @input="$emit('on-input', $event)"
      class="block px-3 py-3 rounded-md border-2 border-t-transparent border-x-transparent border-primary focus:border-primary-dark transition duration-300 ease-in text-text dark:text-light outline-0 w-full bg-transparent placeholder:text-gray-500 dark:placeholder:text-light dark:placeholder:opacity-60 dark:bg-black shadow-[0_8px_24px_rgba(149,157,165,0.2)]"
      :class="{
        'border-red-500 focus:border-red-500': error,
      }"
      :placeholder="placeholder"
      @focus="$emit('on-focus', name)"
      @keypress="$emit('on-keypress', name)"
    />
    <p class="text-sm italic text-red-500 p-1">{{ error }} &nbsp;</p>
    <div
      class="absolute right-2 top-[13px]"
      :class="[isPasswordField ? 'visible opacity-100' : 'invisible opacity-0']"
    >
      <EyeOpen
        v-show="showPassword"
        class="text-2xl p-1 cursor-pointer"
        @click="$emit('on-toggle-password', name)"
      />
      <EyeClosed
        v-show="!showPassword"
        class="text-2xl p-1 cursor-pointer"
        @click="$emit('on-toggle-password', name)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import EyeClosed from '#icons/solid/eye-slash.svg';
import EyeOpen from '#icons/solid/eye.svg';

defineEmits(['on-input', 'on-keypress', 'on-focus', 'on-toggle-password']);

defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
    required: true,
  },
  value: {
    type: String,
    default: '',
    required: true,
  },
  type: {
    type: String,
    default: 'text',
    required: true,
  },
  error: String,
  isPasswordField: {
    type: Boolean,
    default: false,
  },
  showPassword: {
    type: Boolean,
    default: false,
  },
});
</script>
