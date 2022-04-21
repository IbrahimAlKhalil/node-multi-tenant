<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import '#styles/global.css';
import '#styles/fonts.css';

export default defineComponent({
  name: 'the-page-shell',
});
</script>
