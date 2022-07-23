<template>
  <div class="widget widget_links">
    <UnderlineHeading :title="t('footer[\'widget-3\'][\'title\']')" />
    <ul>
      <li
        v-for="item in links"
        :key="item.id"
        class="py-1 list-disc list-inside"
      >
        <a :href="item.url">{{ t(item.title) }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import UnderlineHeading from '#components/ui/underline-heading.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'widget-3',
  components: { UnderlineHeading },
  setup() {
    const i18n = useI18n();

    const links = ref([
      {
        id: 1,
        title: "footer['widget-3']['option-1']",
        url: '#',
      },
      {
        id: 2,
        title: "footer['widget-3']['option-2']",
        url: '#',
      },
      {
        id: 3,
        title: "footer['widget-3']['option-3']",
        url: '#',
      },
      {
        id: 4,
        title: "footer['widget-3']['option-4']",
        url: '#',
      },
    ]);
    return {
      t: i18n.t,
      links,
    };
  },
});
</script>
