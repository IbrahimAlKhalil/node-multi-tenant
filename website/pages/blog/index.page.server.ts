import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const postCategoryService = new ItemsService('post_category', {
    schema: (pageContext as any)?.schema,
  });
  const postService = new ItemsService('post', {
    schema: (pageContext as any)?.schema,
  });
  const tagService = new ItemsService('tag', {
    schema: (pageContext as any)?.schema,
  });

  const categories = await postCategoryService.readByQuery({
    fields: ['id', 'name', 'slug', 'posts', 'parent'],
  });
  const posts = await postService.readByQuery({
    fields: [
      'id',
      'status',
      'title',
      'slug',
      'short_content',
      'date_created',
      'content',
      'featured_image',
      'categories',
      'primary_category',
    ],
  });
  const tags = await tagService.readByQuery({
    fields: ['id', 'name'],
  });

  return {
    pageContext: {
      pageProps: {
        categories,
        posts,
        tags,
      },
    },
  };
};
