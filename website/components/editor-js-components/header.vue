<template>
  <h1 v-if="level === 1" class="qmm_heading_1">{{ text }}</h1>
  <h2 v-else-if="level === 2" class="qmm_heading_2">{{ text }}</h2>
  <h4 v-else-if="level === 4" class="qmm_heading_4">{{ text }}</h4>
  <h5 v-else-if="level === 5" class="qmm_heading_5">{{ text }}</h5>
  <h6 v-else-if="level === 6" class="qmm_heading_6">{{ text }}</h6>
  <h3 v-else class="qmm_heading_3">{{ text }}</h3>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-heading',
  props: {
    level: {
      type: Number,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
});
</script>

<style scoped>
.qmm_heading_1,
.qmm_heading_2,
.qmm_heading_3,
.qmm_heading_4,
.qmm_heading_5,
.qmm_heading_6 {
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.qmm_heading_1 {
  font-size: 3rem;
}
.qmm_heading_2 {
  font-size: 2.75rem;
}
.qmm_heading_3 {
  font-size: 2.5rem;
}
.qmm_heading_4 {
  font-size: 2.15rem;
}
.qmm_heading_5 {
  font-size: 2rem;
}
.qmm_heading_6 {
  font-size: 1.5rem;
}
</style>
