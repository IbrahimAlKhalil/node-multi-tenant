<template>
  <router-view v-slot="{ Component }">
    <suspense>
      <component :is="Component" />
    </suspense>
  </router-view>
</template>

<script lang="ts">
import LayoutDefault from '#layouts/layout-default.vue';

export default defineComponent({
  name: 'the-index',
  components: { LayoutDefault },
});
</script>
