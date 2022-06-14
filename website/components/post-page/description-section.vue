<template>
  <div>
    <the-header text="This is test" />
  </div>
  <section
    id="description"
    class="w-9/12 mx-auto text-justify text-text dark:text-light my-10"
    v-html="content"
  ></section>
</template>

<script lang="ts">
import Header from '#components/editor-js-components/header.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'post-description-section',
  props: ['content'],
  components: {
    'the-header': Header,
  },
  setup() {
    return {};
  },
});
</script>

<style>
/* Headings */
.qmm_heading_1,
.qmm_heading_2,
.qmm_heading_3,
.qmm_heading_4,
.qmm_heading_5,
.qmm_heading_6 {
  font-weight: 500;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  font-weight: bold;
  font-size: 3rem;
}
.qmm_heading_1 {
  font-size: 3rem;
}
.qmm_heading_2 {
  font-size: 2.75rem;
}
.qmm_heading_3 {
  font-size: 2.5rem;
}
.qmm_heading_4 {
  font-size: 2.15rem;
}
.qmm_heading_5 {
  font-size: 2rem;
}
.qmm_heading_5 {
  font-size: 1.5rem;
}
.qmm_para {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
}
.list_ul,
.list_nested_ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
}
.list_ol,
.list_nested_ol {
  list-style-type: decimal;
  margin-left: 1.5rem;
  padding-left: 1.5rem;
}
.list_item {
  margin-bottom: 0.5rem;
}
.qmm_para a,
.qmm_link {
  color: #0070f3;
  text-decoration: underline;
}

/* Block Quote */
.qmm_figure {
  margin: 0;
  margin-bottom: 1rem;
}
.qmm_blockquote {
  border-left: 4px solid #0070f3;
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding-left: 1rem;
  text-align: justify;
}
.qmm_figcaption {
  font-size: 1.125rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: justify;
}
</style>
