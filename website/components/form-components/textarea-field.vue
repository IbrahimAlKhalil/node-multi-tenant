<template>
  <div class="w-full relative">
    <label class="font-bold text-gray-700" :for="name">
      {{ label }}
    </label>
    <textarea
      rows="5"
      :name="name"
      :value="value"
      @input="$emit('on-input', $event)"
      class="block w-full px-3 py-2 mt-3 rounded-md text-text dark:text-white outline-0 border-y-2 border-y-primary focus:border-primary focus:border-x bg-transparent transition duration-300 ease-in placeholder-opacity-60"
      :class="{
        'border-red-500 focus:border-red-500': error,
      }"
      @focus="$emit('on-focus', name)"
      @keypress="$emit('on-keypress', name)"
    ></textarea>
    <p class="text-sm italic text-red-500 p-1">{{ error }} &nbsp;</p>
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
  error: String,
});
</script>
