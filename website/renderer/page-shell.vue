<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <component :is="Component" />
    </Suspense>
  </router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useAuth } from '#stores/auth.store';

import '#styles/global.css';
import '#styles/fonts.css';

export default defineComponent({
  name: 'the-page-shell',
  setup() {
    onMounted(() => {
      const auth = useAuth();

      auth.getUserInfo();
    });
  },
});
</script>
