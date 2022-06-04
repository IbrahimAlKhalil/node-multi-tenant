<template>
  <div class="w-full relative">
    <div
      class="min-h-[50px] rounded-md border-b-2"
      :class="[
        color === 'white'
          ? 'text-white border-white'
          : 'text-text border-primary',
      ]"
      @click="handleAreaClick"
    >
      <input
        type="text"
        readonly
        :placeholder="selectedItems.length ? '' : label"
        class="block px-3 py-2 outline-0 w-full bg-transparent placeholder-opacity-60 absolute top-0 bottom-0 left-0 right-0"
        @click="isDropdownOpen = !isDropdownOpen"
      />
      <span
        class="absolute top-1/2 right-0 -translate-y-1/2 text-xl p-5 cursor-pointer"
        :class="[color === 'white' ? 'text-white' : 'text-primary']"
        @click="isDropdownOpen = !isDropdownOpen"
      >
        <component :is="Down"></component>
      </span>
      <div class="flex flex-wrap gap-2 w-4/5 relative left-0 p-3">
        <span
          v-for="item in selectedItems"
          :key="item.value"
          class="px-2 py-1 bg-primary text-white rounded flex items-center gap-2"
        >
          <span>
            {{ item.label }}
          </span>
          <component
            :is="CrossIcon"
            style="bottom: 0"
            class="cursor-pointer"
            :class="{ hidden: isSingleSelect }"
            @click="$emit('on-remove', item.value)"
          ></component>
        </span>
      </div>
    </div>
    <ul
      class="mb-5 p-3 absolute top-full left-0 w-full bg-white rounded-md z-10"
      v-show="isDropdownOpen"
    >
      <li
        v-for="option in options"
        v-bind:key="option.value"
        @click="$emit('on-select', option)"
        class="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-primary hover:bg-primary hover:text-white"
        :class="{
          'font-bold':
            selectedItems.findIndex((item) => item.value === option.value) !==
            -1,
        }"
      >
        <span>
          {{ option.label }}
        </span>
        <span>
          <component
            :is="TickIcon"
            v-show="
              selectedItems.findIndex((item) => item.value === option.value) !==
              -1
            "
          ></component>
        </span>
      </li>
    </ul>
    <p>{{ error }} &nbsp;</p>
  </div>
</template>

<script lang="ts" setup>
import CrossIcon from '#icons/solid/times-circle.svg';
import TickIcon from '#icons/solid/check-circle.svg';
import Down from '#icons/solid/caret-down.svg';
import { onMounted, onUnmounted, ref } from 'vue';

const isDropdownOpen = ref(false);

defineEmits(['on-select', 'on-remove']);

const handleAreaClick = (e: Event) => {
  e.stopPropagation();
};

const disabledDropdown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', disabledDropdown);
  document.addEventListener('click', () => {
    isDropdownOpen.value = false;
  });
});
onUnmounted(() => {
  document.removeEventListener('keydown', disabledDropdown);
  document.removeEventListener('click', () => {
    isDropdownOpen.value = false;
  });
});

defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: '',
  },
  selectedItems: {
    type: Array,
    default: () => [],
  },
  isSingleSelect: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: 'white',
  },
});
</script>

<style scoped></style>
