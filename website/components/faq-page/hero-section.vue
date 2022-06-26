<template>
  <div class="min-h-[60vh] flex flex-col justify-center items-center">
    <img src="/resources/images/ask.png" alt="Ask" class="my-5" />
    <page-title title="Ask a Question" />
    <p class="hidden md:block text-center mb-5 mt-3 w-1/2 mx-auto">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique nihil
      nam inventore porro eos voluptas.
    </p>
  </div>
</template>

<script setup>
import PageTitle from '#components/ui/page-title.vue';

defineProps(['search', 'category', 'categories']);
defineEmits(['update:search', 'update:category']);
</script>
