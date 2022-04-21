<template>
  <layout-main>
    q
  </layout-main>
</template>

<script lang="ts">
import IconInfo from '#icons/duotone/info.svg';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'index-page',
  components: { LayoutMain, IconInfo },
  setup() {
    return {};
  },
});
</script>
