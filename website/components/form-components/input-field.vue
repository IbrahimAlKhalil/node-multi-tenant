<template>
  <div class="w-full">
    <label class="font-bold text-gray-700" for="email">
      {{ label }}
    </label>
    <input
      :type="type"
      :name="name"
      :value="value"
      @input="$emit('on-input', $event.target.value)"
      class="block px-3 py-2 rounded-md text-white outline-0 border-b-2 border-white focus:border-primary w-full bg-transparent transition duration-300 ease-in placeholder-opacity-60"
      :class="{
        'border-red-500 focus:border-red-500': error,
      }"
      :placeholder="label"
      @focus="$emit('on-focus', 'username')"
      @keypress="$emit('on-keypress', 'username')"
    />
    <p class="text-sm italic text-red-500 p-1">
      {{ error }}
    </p>
  </div>
</template>

<script lang="ts" setup>
defineEmits(['on-input', 'on-keypress', 'on-focus']);
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
  type: {
    type: String,
    default: 'text',
    required: true,
  },
  error: String,
});
</script>
