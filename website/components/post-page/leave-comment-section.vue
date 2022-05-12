<template>
  <section>
    <div class="w-9/12 mx-auto">
      <h2 class="text-2xl font-bold text-center">Leave a comment</h2>
      <form class="flex flex-col">
        <textarea
          name="comment"
          id="comment"
          cols="30"
          rows="10"
          class="p-3 rounded-lg border-2 border-gray-300 focus:border-primary transition outline-none"
        ></textarea>
        <primary-btn title="Submit" @handle-click.prevent="submitComment" />
      </form>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PrimaryBtn from '#components/ui/btn/primary-btn.vue';

export default defineComponent({
  name: 'leave-comment-section',
  components: {
    PrimaryBtn,
  },
  setup() {
    const submitComment = () => {
      console.log('comment');
    };
    return {
      submitComment,
    };
  },
});
</script>
