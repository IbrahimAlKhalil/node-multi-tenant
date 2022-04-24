<template>
  <div class="best-services my-10">
    <div class="container mx-auto flex justify-between items-center gap-10">
      <div class="text-container" style='flex: 1 0 30%'>
        <p class='font-bold text-lg text-text'>SAHARA IT</p>
        <h3 class='font-bold text-5xl text-primary my-5'>Best Services For You</h3>
        <p class='text-text text-sm'>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <div class="media-container flex justify-end items-end" style='flex: 1 0 50%'>
        <img src="/assets/images/Best_services_1.svg" alt="Best Services 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'best-services-section',
  data() {
    return {};
  },
});
</script>

<style scoped></style>
