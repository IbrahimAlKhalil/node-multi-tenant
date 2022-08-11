<template>
  <layout-default v-if="isReady">
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
import { Loading } from 'element-plus/es/components/loading/src/service';
import LayoutDefault from '#layouts/layout-default.vue';

export default defineComponent({
  name: 'the-qmmsoft-app',
  components: { LayoutDefault },
  setup() {
    const authStore = useAuthStore();
    const settingsStore = useSettingsStore();

    const isReady = ref(false);

    onMounted(async () => {
      const loading = Loading({
        fullscreen: true,
        lock: true,
        text: 'Getting user info...',
      });

      await authStore.init();

      loading.text.value = 'Loading settings...';

      await settingsStore.init();

      isReady.value = true;
      loading.close();
    });

    return {
      isReady,
    };
  },
});
</script>
