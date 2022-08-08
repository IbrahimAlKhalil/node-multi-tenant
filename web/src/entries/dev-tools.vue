<template>
  <layout-default>
    <router-view v-slot="{ Component }">
      <transition name="out-in">
        <suspense>
          <component :is="Component" />
        </suspense>
      </transition>
    </router-view>
  </layout-default>
</template>

<script lang="ts">
import LayoutDefault from '#layouts/layout-default.vue';

export default defineComponent({
  name: 'the-dev-tool',
  components: { LayoutDefault },
});
</script>
