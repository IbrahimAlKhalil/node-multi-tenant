<template>
  <section
    id="description"
    class="w-9/12 mx-auto text-justify text-text dark:text-light my-10"
  >
    <component
      v-for="block of blocks"
      :key="block.id"
      :is="'editor-' + block.type"
      :data="block.data"
    >
    </component>
  </section>
</template>

<script lang="ts">
import {
  NestedList,
  Delimiter,
  Paragraph,
  CheckList,
  Header,
  Image,
  Quote,
} from '#components/editor-js-components';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-description-section',
  props: ['content'],
  components: {
    'editor-nestedlist': NestedList,
    'editor-paragraph': Paragraph,
    'editor-delimiter': Delimiter,
    'editor-checklist': CheckList,
    'editor-header': Header,
    'editor-image': Image,
    'editor-quote': Quote,
  },
  data() {
    return {
      blocks: [],
    };
  },
  mounted() {
    this.blocks = this.content?.blocks ?? [];
  },
  setup() {
    return {};
  },
});
</script>

<style>
.qmm_para a,
.qmm_link {
  color: #0070f3;
  text-decoration: underline;
}
</style>
