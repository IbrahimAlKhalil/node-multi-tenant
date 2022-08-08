<template>
  <div @contextmenu="show($event)">
    <slot name="reference"></slot>

    <ctx-menu-host ref="ctxMenuHost">
      <slot></slot>
    </ctx-menu-host>
  </div>
</template>

<script lang="ts" setup>
import CtxMenuHost from './ctx-menu-host.vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  context: null,
});
const ctxMenuHost = ref<null | InstanceType<typeof CtxMenuHost>>(null);

function show(event: MouseEvent) {
  if (props.disabled || !ctxMenuHost.value) {
    return;
  }

  ctxMenuHost.value.show({
    position: {
      x: event.clientX,
      y: event.clientY,
    },
    target: event.currentTarget,
    ...props.context,
  });
}
</script>
