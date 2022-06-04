<template>
  <admin-page-layout>
    <template #sidebar>
      <div class="mt-8">
        <underline-heading title="Status" color="primary" />
        <div class="pl-2">
          <h5 class="font-bold text-lg">Set Status</h5>
          <select-input
            :options="statusOptions"
            :label="'Status'"
            :selectedItems="formData.status"
            @on-select="handleStatusSelect"
            color="primary"
            :isSingleSelect="true"
          />
        </div>
        <div class="flex items-center justify-center">
          <primary-btn title="Update" />
        </div>
      </div>
      <div class="mt-8">
        <underline-heading title="Categories" color="primary" />
        <div class="pl-2">
          <collapse-expand-list
            :postCategory="{ id: 1.1 }"
            :items="categories"
          />
        </div>
      </div>
      <div class="mt-8">
        <underline-heading title="Feature Image" color="primary" />
        <div class="pl-2">
          <upload-file />
        </div>
      </div>
      <div class="mt-8">
        <underline-heading title="Creation Info" color="primary" />
        <div class="pl-2">
          <p class="text-text text-lg flex items-center gap-2 my-2">
            <span class="font-bold">Create at: </span>
            <span>02-06-2022</span>
            <span>at 5:44:00 pm</span>
          </p>
          <p class="text-text text-lg flex items-center gap-2 my-2">
            <span class="font-bold">Create at: </span>
            <span>02-06-2022</span>
            <span>at 5:44:00 pm</span>
          </p>
        </div>
      </div>
      <div class="mt-8">
        <underline-heading title="Revision Info" color="primary" />
        <div class="pl-2">
          <revision-info-card />
          <revision-info-card status="secondary" />
          <revision-info-card status="draft" />
        </div>
      </div>
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
        <div class="title mt-5">
          <label for="title" class="block font-bold text-lg text-text"
            >Title</label
          >
          <input
            type="text"
            id="title"
            placeholder="Title of the post"
            class="block px-2 py-1 border border-gray-300 focus:border-primary rounded outline-none w-full"
          />
        </div>
        <div class="slug mt-5">
          <label for="slug" class="block font-bold text-lg text-text"
            >Slug</label
          >
          <input
            type="text"
            id="slug"
            placeholder="Slug of the post"
            class="block px-2 py-1 border border-gray-300 focus:border-primary rounded outline-none w-full"
          />
        </div>
        <div class="body my-5">
          <label for="body" class="block font-bold text-lg text-text"
            >Body</label
          >
          <div id="editor-vue" class="border border-gray-300 rounded" />
        </div>
      </form>
    </div>
  </admin-page-layout>
</template>

<script lang="ts">
import CollapseExpandList from '#components/ui/collapse-expand-list/list.vue';
import SelectInput from '#components/form-components/select-input.vue';
import underlineHeading from '#components/ui/underline-heading.vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import { defineComponent, onMounted, ref } from 'vue';
import AdminPageLayout from '#layouts/admin-page.vue';
import UploadFile from '#components/blog-create/uploadFile.vue';
import RevisionInfoCard from '#components/blog-create/revision-info-card.vue';

type formDataType = {
  title: string;
  slug: string;
  body: string;
  status: { label: string; value: string }[];
};

export default defineComponent({
  name: 'admin-page',
  components: {
    CollapseExpandList,
    underlineHeading,
    RevisionInfoCard,
    AdminPageLayout,
    SelectInput,
    PrimaryBtn,
    UploadFile,
  },
  setup() {
    const value = ref('');
    const renderedHtml = ref('');
    const formData = ref<formDataType>({
      title: '',
      slug: '',
      body: '',
      status: [],
    });
    const categories = ref([
      {
        id: '1',
        title: 'Category 1',
        subCategories: [
          {
            id: '1.1',
            title: 'Sub Category 1.1',
          },
          {
            id: '1.2',
            title: 'Sub Category 1.2',
            subCategories: [
              {
                id: '1.2.1',
                title: 'Sub Sub Category 1.2.1',
              },
              {
                id: '1.2.2',
                title: 'Sub Sub Category 1.2.2',
              },
            ],
          },
        ],
      },
      {
        id: '2',
        title: 'Category 2',
        subCategories: [
          {
            id: '2.1',
            title: 'Sub Category 2.1',
          },
          {
            id: '2.2',
            title: 'Sub Category 2.2',
          },
        ],
      },
    ]);

    // actions
    const handleStatusSelect = (option: { label: string; value: string }) => {
      formData.value.status = [option];
    };

    const statusOptions = [
      {
        label: 'Draft',
        value: 'draft',
      },
      {
        label: 'Published',
        value: 'published',
      },
    ];

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
      handleStatusSelect,
      statusOptions,
      renderedHtml,
      formData,
      categories,
      save,
    };
  },
});
</script>
