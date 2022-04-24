<template>
  <div class="footer bg-primary-darker text-white">
    <div class="container mx-auto flex justify-between gap-10 py-8">
      <div class="widget1 flex-1">
        <slot name="widget1"></slot>
      </div>
      <div class="widget2 flex-1">
        <slot name="widget2"></slot>
      </div>
      <div class="widget3 flex-1">
        <slot name="widget3"></slot>
      </div>
    </div>
    <pre-footer />
  </div>
</template>

<script lang="ts">
import PreFooter from '#components/footer/pre-footer.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'the-footer',
  components: {
    'pre-footer': PreFooter,
  },
  setup() {
    return {};
  },
});
</script>
