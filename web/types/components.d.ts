// generated by unplugin-vue-components
// We suggest you to commit this file into source control
// Read more: https://github.com/vuejs/core/pull/3399
import '@vue/runtime-core'

export {}

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    CtxItem: typeof import('./../src/components/ctx-menu/ctx-item.vue')['default']
    CtxMenu: typeof import('./../src/components/ctx-menu/ctx-menu.vue')['default']
    CtxMenuHost: typeof import('./../src/components/ctx-menu/ctx-menu-host.vue')['default']
    CtxSubMenu: typeof import('./../src/components/ctx-menu/ctx-sub-menu.vue')['default']
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
  export interface ComponentCustomProperties {
    vLoading: typeof import('element-plus/es')['ElLoadingDirective']
  }
}
