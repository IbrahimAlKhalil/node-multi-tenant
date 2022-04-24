<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import '#styles/fonts.css';
import '#styles/global.css';

export default defineComponent({
  name: 'the-page-shell',
});
</script>
