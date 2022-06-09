import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const itemsService = new ItemsService('post', {
    schema: (pageContext as any)?.schema,
  });

  const post = await itemsService.readByQuery({
    filter: {
      slug: {
        _eq: pageContext.urlPathname.split('/')[2],
      },
    },
    fields: [
      'id',
      'status',
      'title',
      'slug',
      'short_content',
      'date_created',
      'user_created.first_name',
      'user_created.last_name',
      'content',
      'featured_image',
      'categories.*.name',
      'primary_category.name',
      'primary_category.slug',
      'reactions',
      'tags.*.name',
      'tag.name',
      'comments',
      'is_featured',
    ],
  });
  console.log('Post.Page.Server : ', post);

  return {
    pageContext: {
      pageProps: {
        post: post[0],
      },
    },
  };
};
