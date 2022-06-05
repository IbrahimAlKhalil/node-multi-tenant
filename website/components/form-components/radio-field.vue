<template>
  <h4 class="text-left self-start capitalize">{{ title }}</h4>
  <div
    class="flex items-center gap-5 px-3 py-2 rounded-md border-b-2 border border-transparent border-b-primary hover:border-primary hover:border-x hover:border-t text-primary dark:text-secondary outline-0 w-full bg-transparent transition duration-300 ease-in placeholder-opacity-60"
    :class="{
      'border-red-500 focus:border-red-500': error,
    }"
  >
    <div v-for="option of options" :key="option.value">
      <input
        type="radio"
        :name="name"
        :value="option.value"
        :id="option.label"
        @input="$emit('on-input', $event)"
        @focus="$emit('on-focus', name)"
        @keypress="$emit('on-keypress', name)"
        class="w-5 h-5"
      />
      <label :for="option.label" class="font-bold">
        <div class="pointer border-primary dark:border-secondary"></div>
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'radio-field',
  props: {
    title: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  emits: ['on-input', 'on-keypress', 'on-focus'],
  setup(props, { emit }) {
    return {
      emit,
    };
  },
});
</script>

<style scoped>
input[type='radio'] {
  display: none;
}
label {
  cursor: pointer;
  display: flex;
}
.pointer {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.3s ease;
  position: relative;
}
.pointer::after {
  content: '';
  width: 50%;
  height: 50%;
  background: var(--color-primary);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
}
input:checked + label {
  color: var(--color-primary);
}
input:checked + label .pointer {
  border-color: var(--color-primary);
}
input:checked + label .pointer::after {
  opacity: 1;
}
</style>
