<template>
  <el-dropdown
    @visible-change="handleVisibleChange"
    :hide-on-click="false"
    trigger="contextmenu"
    ref="dropdown"
  >
    <span class="absolute" ref="target"></span>

    <template #dropdown>
      <el-dropdown-menu>
        <slot />
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import type { CtxMenuContext } from './types/ctx-menu-context';
import type { ElDropdown } from 'element-plus';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ctx-menu-host',
  props: {
    activeClass: {
      default: 'ctx-menu-active',
      type: String as PropType<string>,
    },
  },
  emits: ['hide', 'show', 'command'],
  setup(props, { emit }) {
    const context = ref<CtxMenuContext | null>(null);
    const dropdown = ref<InstanceType<typeof ElDropdown> | null>(null);
    const target = ref<HTMLSpanElement | null>(null);

    provide('ctx-menu-host', (getCurrentInstance() as any).ctx);

    return {
      dropdown,
      context,
      target,

      handleVisibleChange,
      toggle,
      show,
      hide,
    };

    function handleVisibleChange(visible: boolean) {
      if (visible) {
        return emit('show');
      }

      context.value?.target.classList.remove(props.activeClass);
      context.value = null;
      emit('hide');
    }
    function toggle(_context: CtxMenuContext) {
      if (!dropdown.value) {
        return;
      }

      if (dropdown.value.popperRef?.open) {
        hide();
      } else {
        show(_context);
      }
    }
    function show(_context: CtxMenuContext) {
      context.value = Object.freeze(_context);

      if (!dropdown.value || !target.value) {
        return;
      }

      target.value.style.left = `${_context.position.x}px`;
      target.value.style.top = `${_context.position.y}px`;

      dropdown.value.handleOpen();

      context.value.target.classList.add(props.activeClass);
    }
    function hide() {
      if (!dropdown.value) {
        return;
      }

      dropdown.value.handleClose();
    }
  },
});
</script>
