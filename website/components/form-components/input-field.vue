<template>
  <div class="w-full relative">
    <label class="font-bold text-gray-700" for="email">
      {{ label }}
    </label>
    <input
      :type="type"
      :name="name"
      :value="value"
      @input="$emit('on-input', $event)"
      class="block px-3 py-2 rounded-md text-white outline-0 border-b-2 border-white focus:border-primary w-full bg-transparent transition duration-300 ease-in placeholder-opacity-60"
      :class="{
        'border-red-500 focus:border-red-500': error,
      }"
      :placeholder="placeholder"
      @focus="$emit('on-focus', name)"
      @keypress="$emit('on-keypress', name)"
    />
    <p class="text-sm italic text-red-500 p-1">
      {{ error }} &nbsp;
    </p>
    <div
      class="absolute right-0 top-1/2 -translate-y-1/2"
      :class="[isPasswordField ? 'visible opacity-100' : 'invisible opacity-0']"
    >
      <component
        v-show="showPassword"
        :is="EyeOpen"
        class="text-2xl p-1 cursor-pointer"
        @click="$emit('on-toggle-password', name)"
      ></component>
      <component
        v-show="!showPassword"
        :is="EyeClosed"
        class="text-2xl p-1 cursor-pointer"
        @click="$emit('on-toggle-password', name)"
      ></component>
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
