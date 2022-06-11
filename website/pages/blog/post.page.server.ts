import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const postService = new ItemsService('post', {
    schema: (pageContext as any)?.schema,
  });

  const commentsService = new ItemsService('comment', {
    schema: (pageContext as any)?.schema,
  });

  const post = await postService.readByQuery({
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
      'categories.*.slug',
      'primary_category.name',
      'primary_category.slug',
      'reactions',
      'tags.*.name',
      'tag.name',
      'comments',
      'is_featured',
    ],
  });
  const comments = await commentsService.readByQuery({
    filter: {
      post: {
        _eq: post[0].id,
      },
    },
    fields: [
      'id',
      'status',
      'content',
      'date_created',
      'user_created.first_name',
      'user_created.last_name',
    ],
  });
  console.log('Post.Page.Server : ', comments);

  return {
    pageContext: {
      pageProps: {
        post: post[0],
        comments,
      },
    },
  };
};
