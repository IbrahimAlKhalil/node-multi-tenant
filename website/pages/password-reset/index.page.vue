<template>
  <layout-main>
    <common-scrollable-hero>
      <PasswordResetForm />
    </common-scrollable-hero>
  </layout-main>
</template>

<script lang="ts">
import CommonScrollableHero from '#layouts/common-scrollable-hero.vue';
import PasswordResetForm from '#components/password-reset/index.vue';
import LayoutMain from '#layouts/main.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'password-reset',
  components: {
    CommonScrollableHero,
    PasswordResetForm,
    LayoutMain,
  },
  setup() {
    return {};
  },
});
</script>
