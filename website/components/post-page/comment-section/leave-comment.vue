<template>
  <div class="my-5" :class="{ container: !fluid }">
    <div
      class="input-area bg-gray-200 rounded-md border border-gray-500 relative"
    >
      <textarea
        name="comment"
        id="comment"
        rows="7"
        class="block w-full h-full border-none outline-none bg-transparent p-2"
        :value="comment"
        @input="$emit('update:comment', $event.target.value)"
        @keydown="$emit('handle-mention', $event)"
      ></textarea>
      <div
        v-show="isMentionActive"
        class="absolute top-0 left-0 w-full h-full bg-[rgb(0,0,0,.4)] flex justify-center items-center"
        @click="$emit('close-mention')"
      >
        <ul class="bg-white rounded max-h-[120px] overflow-y-auto pr-3">
          <li
            class="p-2 font-bold text-sm border-b cursor-pointer hover:text-primary transition"
            v-for="item in mentionData"
            :key="item.id"
            @click="$emit('select-mention-person', item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div
        class="action-buttons absolute bottom-2 right-5 flex items-center gap-5"
      >
        <button
          class="text-text hover:text-dark bg-none border-none outline-none text-3xl"
          @click="$emit('open-mention')"
        >
          @
        </button>
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
  emits: [
    'update:comment',
    'handle-mention',
    'close-mention',
    'select-mention-person',
    'open-mention',
  ],
  props: {
    fluid: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
    },
    submitComment: {
      type: Function,
      required: true,
    },
    isMentionActive: {
      type: Boolean,
      default: false,
    },
    mentionData: {
      type: Array,
    },
  },
  setup() {
    const update = (e) => {
      console.log(e.key === '@');
    };
    return {
      update,
    };
  },
});
</script>
