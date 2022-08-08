import type Host from '#components/ctx-menu/ctx-menu-host.vue';
import { inject } from 'vue';

export function useCtxMenuHost(): InstanceType<typeof Host> {
  const host = inject<InstanceType<typeof Host>>('ctx-menu-host');

  if (!host) {
    throw new Error(
      "Cannot find ctx-menu-host component in any of this component's parent",
    );
  }

  return host;
}
