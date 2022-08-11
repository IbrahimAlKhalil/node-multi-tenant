<template>
  <slot name="reference" :show="show"></slot>

  <ctx-menu-host
    @command="$emit('command', $event)"
    @show="$emit('show', $event)"
    @hide="$emit('hide', $event)"
    ref="host"
  >
    <slot />
  </ctx-menu-host>
</template>

<script lang="ts" setup>
import CtxMenuHost from './ctx-menu-host.vue';
import type { PropType } from 'vue';

defineEmits(['show', 'hide', 'command']);

const props = defineProps({
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  context: null,
});
const host = ref<null | InstanceType<typeof CtxMenuHost>>(null);

function show(event: MouseEvent) {
  if (props.disabled || !host.value) {
    return;
  }

  const rect = (event.currentTarget as Element).getBoundingClientRect();

  host.value.toggle({
    position: {
      x: event.clientX - rect.x,
      y: event.clientY - rect.y - 20,
    },
    target: event.currentTarget,
    ...props.context,
  });
}
</script>
