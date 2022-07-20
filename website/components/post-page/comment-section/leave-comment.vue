<template>
  <div class="my-5" :class="{ container: !fluid }">
    <div
      class="input-area bg-gray-200 dark:bg-dark rounded-md border border-gray-500 relative dark:text-light"
    >
      <textarea
        name="comment"
        id="comment"
        rows="7"
        class="block w-full h-full border-none outline-none bg-transparent p-2"
        :value="commentValue"
        @input="$emit('update:comment', $event.target.value)"
      ></textarea>
      <div
        class="action-buttons absolute bottom-2 right-5 flex items-center gap-5"
      >
        <primary-btn
          title="submit"
          size="small"
          @handle-click="submitComment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'leave-comment',
  components: { PrimaryBtn },
  emits: ['update:comment'],
  props: {
    fluid: {
      type: Boolean,
      default: false,
    },
    commentValue: {
      type: String,
      required: false,
      default: '',
    },
    submitComment: {
      type: Function,
      required: true,
    },
    parent: {
      type: Number,
      required: false,
      default: null,
    },
    mention: {
      type: String,
      required: false,
      default: null,
    },
  },
  setup() {
    return {};
  },
});
</script>
