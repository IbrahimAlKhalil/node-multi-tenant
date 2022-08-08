<template>
  <li
    @keydown.enter="emitClick"
    @click.stop="emitClick"
    :class="liClass"
    tabindex="0"
  >
    <div class="sub-menu-label">
      <div>
        <slot name="icon"> <i v-if="icon" :class="icon"></i> </slot>&nbsp;&nbsp;
        <slot name="label">
          <template v-if="label">
            {{ label }}
          </template>
        </slot>
      </div>

      <div class="arrow-wrapper">
        <fai icon="chevron-right" />
      </div>
    </div>

    <template v-if="visible">
      <div class="empty-space"></div>

      <ul class="el-dropdown-menu sub-menu">
        <slot></slot>
      </ul>
    </template>
  </li>
</template>

<script>
export default {
  inject: ['ctxMenuHost'],
  props: {
    label: String,
    icon: String,
    disabled: [Boolean, Function],
  },

  data() {
    return {
      visible: false,
    };
  },

  asyncComputed: {
    disabledClass: {
      async get() {
        const { disabled } = this.$props;

        if (typeof disabled !== 'function') {
          return {
            'is-disabled': !!disabled,
          };
        }

        return {
          'is-disabled': await disabled(this.ctxMenuHost.context),
        };
      },
      default: { 'is-disabled': true },
    },
  },

  computed: {
    liClass() {
      return [
        {
          'sub-menu-wrapper': true,
          'el-dropdown-menu__item': true,
        },
        this.disabledClass,
      ];
    },
  },

  methods: {
    emitClick(event) {
      this.$emit('click', event, this.ctxMenuHost.context);
      this.visible = !this.visible;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dropdown-menu.sub-menu {
  position: absolute;
  left: calc(100% + 6px);
  top: -15px;
}

.sub-menu-wrapper {
  max-height: 36px;
  position: relative;
}

.sub-menu-label {
  display: flex;
  justify-content: space-between;
}

.arrow-wrapper {
  font-size: 12px;
}

.empty-space {
  height: calc(100% + 18px);
  width: 6px;
  position: absolute;
  left: 100%;
  top: -8px;
}
</style>
