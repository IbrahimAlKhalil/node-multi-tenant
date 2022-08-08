<template>
  <div
    class="fixed top-0 left-0 w-screen h-screen whitespace-nowrap z-40 overflow-y-auto"
    @keydown.esc.stop="hideEscape"
    @contextmenu.stop="hide"
    @click.stop="hide"
    @wheel.prevent=""
    v-if="visible"
  >
    <ul class="menu" @keydown="navigate" tabindex="0" ref="menu">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang="ts">
import type { CtxMenuContext } from './types/ctx-menu-context';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'ctx-menu-host',
  props: {
    activeClass: {
      default: 'ctx-menu-active',
      type: String as PropType<string>,
    },
    navigation: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    fromEmitter: String as PropType<string>,
  },
  emits: ['hide', 'hiding', 'show'],
  setup(props, { emit }) {
    const visible = ref(false);
    const context = ref<CtxMenuContext | null>(null);
    const menu = ref<Element | null>(null);

    provide('ctx-menu-host', (getCurrentInstance() as any).ctx);

    return {
      visible,
      context,
      menu,

      addRmActiveClass,
      updateContext,
      hideEscape,
      navigate,
      show,
      hide,
    };

    function show(_context: CtxMenuContext) {
      visible.value = true;
      context.value = Object.freeze(_context);

      addRmActiveClass();

      nextTick(() => {
        if (!menu.value) {
          return;
        }

        const menuElm = menu.value as HTMLElement | SVGElement;

        let { x, y } = _context.position;
        const scrollBarWidth =
          window.innerWidth - document.documentElement.offsetWidth;

        if (x + menuElm.clientWidth + 5 >= window.innerWidth - scrollBarWidth) {
          x -= menuElm.clientWidth;
        }

        if (
          y + menuElm.clientHeight + 5 >=
          window.innerHeight - scrollBarWidth
        ) {
          y -= menuElm.clientHeight;
        }

        menuElm.style.left = `${Math.max(0, x)}px`;
        menuElm.style.top = `${Math.max(0, y)}px`;

        if (props.navigation) {
          menuElm.focus();
        }
      });
    }
    function hide() {
      emit('hiding');

      visible.value = false;
      addRmActiveClass();

      context.value = null;
      emit('hide');
    }
    function hideEscape(event: KeyboardEvent) {
      if (event.code !== 'Escape') {
        return;
      }

      hide();
    }
    function navigate(event: KeyboardEvent) {
      const activeElement = document.activeElement as Element | null;
      const codes = ['ArrowUp', 'ArrowDown'];
      const { code } = event;

      if (!codes.includes(code) || !menu.value || !activeElement) {
        return;
      }

      const { lastElementChild, firstElementChild } = menu.value;
      const { previousElementSibling, nextElementSibling } = activeElement;

      let target: Element | null;

      if (activeElement === menu.value) {
        target = code === codes[0] ? lastElementChild : firstElementChild;
      } else if (lastElementChild === activeElement && code === codes[1]) {
        target = firstElementChild;
      } else if (firstElementChild === activeElement && code === codes[0]) {
        target = lastElementChild;
      } else {
        target =
          code === codes[0] ? previousElementSibling : nextElementSibling;
      }

      if (target) {
        (target as HTMLElement | SVGElement).focus();
      }
    }
    function addRmActiveClass() {
      if (
        !context.value?.target ||
        !(context.value.target instanceof Element)
      ) {
        return;
      }

      if (visible.value) {
        context.value.target.classList.add(props.activeClass);
      } else {
        context.value.target.classList.remove(props.activeClass);
      }
    }
    function updateContext(_context: CtxMenuContext) {
      context.value = Object.freeze({
        ...context,
        ..._context,
      });
    }
  },
});
</script>
