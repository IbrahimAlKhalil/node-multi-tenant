<template>
  <the-header />
  <slot />
  <the-footer>
    <template v-slot:widget1>
      <widget-1 />
    </template>
    <template v-slot:widget2>
      <widget-2 />
    </template>
    <template v-slot:widget3>
      <widget-3 />
    </template>
  </the-footer>
</template>

<script lang="ts">
import TheHeader from '#layouts/partials/header.vue';
import TheFooter from '#layouts/partials/footer.vue';
import Widget1 from '#components/footer/widget-1.vue';
import Widget2 from '#components/footer/widget-2.vue';
import Widget3 from '#components/footer/widget-3.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'layout-main',
  components: { TheHeader, TheFooter, Widget1, Widget2, Widget3 },
});
</script>
