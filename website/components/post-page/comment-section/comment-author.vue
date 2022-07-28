<template>
  <div class="flex items-center gap-2">
    <pre>{{ data?.institute?.code }}</pre>
    <the-avatar
      :size="40"
      :url="
        authorInfo?.pictureId
          ? 'https://ap1.qmmsoft.local/storage/' +
            data?.institute?.code +
            '/' +
            authorInfo.pictureId
          : undefined
      "
      :text="authorInfo?.I18n ? authorInfo?.I18n[0]?.name : ''"
    />
    <h5 class="font-bold text-text dark:text-light text-xl">
      {{ authorInfo?.I18n ? authorInfo?.I18n[0]?.name : '' }}
    </h5>
    <p class="text-sm text-gray-500 dark:text-gray-200">
      {{ data.date.split('T')[0] }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheAvatar from '#components/ui/avatar.vue';

export default defineComponent({
  name: 'comment-author',
  components: { TheAvatar },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      authorInfo: {},
    };
  },
  methods: {
    async findAuthor() {
      const response = await (
        await fetch(
          `https://${
            this.data?.institute.cluster.host
          }/query?query=${encodeURIComponent(
            JSON.stringify({
              type: 'findUnique',
              model: 'user',
              query: {
                where: { id: Number(this.data?.authorId) },
                include: { I18n: true },
              },
            }),
          )}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-qm-institute-id': '100',
            },
          },
        )
      ).json();
      console.log(response);
      this.authorInfo = response;
    },
  },
  mounted() {
    this.findAuthor();
  },
});
</script>
