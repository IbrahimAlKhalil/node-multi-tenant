<template>
  <p class="qmm_para">
    {{ text }}
  </p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-paragraph',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.qmm_para {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
