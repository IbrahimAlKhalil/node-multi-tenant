<template>
  <h3
    class="font-bold text-center text-5xl text-primary my-8 uppercase underline"
  >
    Editor
  </h3>
  <div class="w-4/5 mx-auto border rounded p-5">
    <div class id="editor-vue" />
  </div>
  <div class="flex justify-center items-center my-5">
    <button
      class="bg-primary rounded px-5 py-2 text-white font-bold"
      type="button"
      name="button"
      @click="save()"
    >
      save
    </button>
  </div>
  <div class="w-4/5 mx-auto border rounded p-5">
    <!-- value json data to html -->
    <div id="render-html-vue" v-html="renderedHtml"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'admin-page',
  setup() {
    const value = ref('');
    const renderedHtml = ref('');

    const convertDataToHtml = async (blocks) => {
      var convertedHtml = '';
      blocks.map((block) => {
        switch (block.type) {
          case 'header':
            convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            break;
          case 'embded':
            convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
            break;
          case 'paragraph':
            convertedHtml += `<p>${block.data.text}</p>`;
            break;
          case 'delimiter':
            convertedHtml += '<hr />';
            break;
          case 'image':
            convertedHtml += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
            break;
          case 'list':
            convertedHtml += '<ul>';
            block.data.items.forEach(function (li) {
              convertedHtml += `<li>${li}</li>`;
            });
            convertedHtml += '</ul>';
            break;
          default:
            console.log('Unknown block type', block.type);
            break;
        }
      });
      return convertedHtml;
    };

    const save = async () => {
      if (!window) return;
      editor.save().then(async (saveData) => {
        value.value = JSON.stringify(saveData, null, 2);
        renderedHtml.value = await convertDataToHtml(saveData.blocks);
      });
    };

    onMounted(async () => {
      const Header = await import('@editorjs/header');
      const Paragraph = await import('@editorjs/paragraph');
      const List = await import('@editorjs/list');
      const Checklist = await import('@editorjs/checklist');
      const Quote = await import('@editorjs/quote');

      import('@editorjs/editorjs').then(
        (EditorJS) =>
          (window.editor = new EditorJS.default({
            holder: 'editor-vue',
            autofocus: true,
            initialBlock: 'paragraph',
            tools: {
              header: {
                class: Header.default,
                inlineToolbar: ['link', 'bold', 'italic'],
              },
              paragraph: {
                class: Paragraph.default,
                inlineToolbar: true,
              },
              list: {
                class: List.default,
                inlineToolbar: true,
              },
              checklist: {
                class: Checklist.default,
                inlineToolbar: true,
              },
              quote: {
                class: Quote.default,
                inlineToolbar: true,
              },
            },
            onReady: function () {
              console.log('ready');
            },
            onChange: function () {
              console.log('change');
            },
          })),
      );
    });
    return {
      save,
      renderedHtml,
    };
  },
});
</script>

<style>
h1 {
  font-size: 3rem;
  font-weight: bold;
}
h2 {
  font-size: 2.5rem;
  font-weight: bold;
}
h3 {
  font-size: 2rem;
  font-weight: bold;
}
h4 {
  font-size: 1.75rem;
  font-weight: bold;
}
h5 {
  font-size: 1.5rem;
  font-weight: bold;
}
h6 {
  font-size: 1rem;
  font-weight: bold;
}
ul {
  list-style: square inside;
}
a {
  text-decoration: underline;
  color: blue;
}
#render-html-vue > * {
  margin-bottom: 10px;
}
</style>
