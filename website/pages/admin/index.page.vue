<template>
  <admin-page-layout>
    <template #sidebar>
      <p class="">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eum, iusto!
        Quidem consectetur ex tenetur officiis eveniet nisi, incidunt amet.
        Tempora.
      </p>
    </template>
    <div>
      <div class="intro border-b flex justify-center border-b-gray-300 mb-8">
        <h3
          class="text-3xl font-bold text-center text-primary pb-2 px-2 -mb-[2px] w-fit relative after:block after:absolute after:bottom-0 after:left-0 after:w-full after:h-[4px] after:bg-primary after:rounded"
        >
          Post Create
        </h3>
      </div>
      <form>
        <div class="title">
          <label for="title" class="block font-bold text-lg">Title</label>
          <input
            type="text"
            id="title"
            class="block px-2 py-1 border border-gray-300 focus:border-primary rounded outline-none w-full"
          />
        </div>
        <div class="slug">
          <label for="slug" class="block font-bold text-lg">Slug</label>
          <input
            type="text"
            id="slug"
            class="block px-2 py-1 border border-gray-300 focus:border-primary rounded outline-none w-full"
          />
        </div>
        <div class="body">
          <label for="body" class="block font-bold text-lg">Body</label>
          <div id="editor-vue" class="border border-gray-300 rounded" />
        </div>
      </form>
    </div>
  </admin-page-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import AdminPageLayout from '#layouts/admin-page.vue';

export default defineComponent({
  name: 'admin-page',
  components: {
    AdminPageLayout,
  },
  setup() {
    const value = ref('');
    const renderedHtml = ref('');

    type dataBlockType = {
      type: string;
      data: {
        level: string;
        text: string;
        caption: string;
        embed: string;
        items: string[];
        file: {
          url: string;
        };
      };
    };

    const convertDataToHtml = async (blocks: dataBlockType[]) => {
      var convertedHtml = '';
      blocks.map((block: dataBlockType) => {
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
            block.data.items.forEach(function (li: string) {
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
      editor.save().then(async (saveData: any) => {
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
