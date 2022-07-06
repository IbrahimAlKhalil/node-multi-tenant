<template>
  <hr class="my-5" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'editor-heading',
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
});
</script>
