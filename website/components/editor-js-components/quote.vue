<template>
  <figure class="qmm_figure">
    <blockquote class="qmm_blockquote">
      <p>{{ data.text }}</p>
    </blockquote>
    <figcaption class="qmm_figcaption">
      <em>{{ data.caption }}</em>
    </figcaption>
  </figure>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'the-quote',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
});
</script>

<style scoped></style>
