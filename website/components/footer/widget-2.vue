<template>
  <div class="widget widget_links">
    <UnderlineHeading :title="t('footer[\'widget-2\'][\'title\']')" />
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
  name: 'widget-2',
  components: {
    UnderlineHeading,
  },
  setup() {
    const i18n = useI18n();
    // States
    const links = ref([
      {
        id: 1,
        title: "footer['widget-2']['about-us']",
        url: '/#about',
      },
      {
        id: 2,
        title: "footer['widget-2']['contact']",
        url: '/contact',
      },
      {
        id: 3,
        title: "footer['widget-2']['blog']",
        url: '/blog',
      },
      {
        id: 4,
        title: "footer['widget-2']['faq']",
        url: '/faq',
      },
    ]);
    return {
      t: i18n.t,
      links,
    };
  },
});
</script>
