<template>
  <li
    @keydown.enter="emitClick"
    @click.stop="emitClick"
    :class="liClass"
    tabindex="0"
  >
    <router-link :class="linkClass" :target="target" v-if="to" :to="to">
      <slot name="icon"> <i :class="icon" v-if="icon"></i> </slot>&nbsp;&nbsp;
      <slot>
        <template v-if="label">
          {{ label }}
        </template>
      </slot>
    </router-link>

    <template v-else>
      <slot name="icon"> <i v-if="icon" :class="icon"></i> </slot>&nbsp;&nbsp;
      <slot>
        <template v-if="label">
          {{ label }}
        </template>
      </slot>
    </template>
  </li>
</template>

<script lang="ts" setup>
import type { CtxMenuContext } from './types/ctx-menu-context';
import type { PropType } from 'vue';

const props = defineProps({
  label: String as PropType<string>,
  icon: String as PropType<string>,
  divided: Boolean as PropType<boolean>,
  disabled: [Boolean, Function] as PropType<
    boolean | ((ctx: CtxMenuContext | null) => boolean | Promise<boolean>)
  >,
  to: String as PropType<string>,
  target: String as PropType<string>,
});
const emit = defineEmits(['click']);

const ctxMenuHost = useCtxMenuHost();
const disabled = ref(false);

const liClass = computed(() => {
  if (props.to) {
    return {
      'list-style-none': true,
    };
  }

  return {
    'menu-item': true,
    'menu-item-divided': !!props.divided,
    'is-disabled': disabled.value,
  };
});
const linkClass = computed(() => {
  return {
    'menu-item': true,
    'menu-item-divided': !!props.divided,
    'd-block': true,
    'trans-none': true,
    'text-decor-none': true,
    'is-disabled': disabled.value,
  };
});

initDisabled();
watch(() => props.disabled, initDisabled);

async function initDisabled() {
  if (typeof props.disabled !== 'function') {
    disabled.value = !!props.disabled;
  } else {
    disabled.value = await props.disabled(ctxMenuHost.context);
  }
}

function emitClick(event: KeyboardEvent | MouseEvent) {
  emit('click', event, ctxMenuHost.context);
  ctxMenuHost.hide();
}
</script>
