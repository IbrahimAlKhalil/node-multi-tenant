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

<style scoped>
/* Block Quote */
.qmm_figure {
  margin: 0;
  margin-bottom: 1rem;
}
.qmm_blockquote {
  border-left: 4px solid #0070f3;
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding-left: 1rem;
  text-align: justify;
}
.qmm_figcaption {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
