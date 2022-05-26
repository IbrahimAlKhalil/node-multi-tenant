<template>
  <TutorialPage>
    <template #left-sidebar>
      <the-list>
        <list-item title="This is test" spacing="px-5 py-3"></list-item>
        <list-item title="This is test" spacing="px-5 py-3"></list-item>
        <list-item title="This is test" spacing="px-5 py-3"></list-item>
      </the-list>
    </template>
    <div>
      <h3>Main body</h3>
    </div>
  </TutorialPage>
</template>

<script lang="ts">
import TutorialPage from '#layouts/tutorial-page.vue';
import { TheList } from '#components/ui/list';
import { ListItem } from '#components/ui/list';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'tutorial-page',
  components: {
    TutorialPage,
    TheList,
    ListItem,
  },

  setup() {
    return {};
  },
});
</script>
