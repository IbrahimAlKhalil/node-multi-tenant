<template>
  <a :class="{ active: pageContext.urlPathname === href }" :href="href">
    <slot />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ssr-link',
  props: {
    href: {
      type: String,
      required: true,
    },
  },
});
</script>

<script lang="ts" setup>
import { usePageContext } from '#modules/use-page-context';
const pageContext = usePageContext();
</script>
