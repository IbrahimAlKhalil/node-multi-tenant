<template>
  <p class="qmm_para" v-html="data.text"></p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'editor-paragraph',
  props: {
    data: {
      type: Object,
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
