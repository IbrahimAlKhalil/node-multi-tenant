import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const { search } = pageContext.urlParsed;

  const postService = new ItemsService('post', {
    schema: (pageContext as any)?.schema,
  });
  const postCategoryService = new ItemsService('post_category', {
    schema: (pageContext as any)?.schema,
  });
  const tagService = new ItemsService('tag', {
    schema: (pageContext as any)?.schema,
  });

  // Post fields
  const postFields = [
    'id',
    'slug',
    'title',
    'status',
    'content',
    'categories',
    'date_created',
    'short_content',
    'featured_image',
    'primary_category',
  ];

  // blogsAggregate
  const blogsAggregate = await postService.readByQuery({
    aggregate: {
      count: ['*'],
    },
  });

  const categories = await postCategoryService.readByQuery({
    fields: ['id', 'name', 'slug', 'posts', 'parent'],
  });
  const posts = await postService.readByQuery({
    limit: 5,
    page: Number(search?.page),
    fields: postFields,
  });
  // TODO: add category filter
  // TODO: add tag filter
  const searchPosts = await postService.readByQuery({
    search: search?.sq,
    fields: postFields,
  });

  const featuredPosts = await postService.readByQuery({
    filter: {
      is_featured: {
        _eq: true,
      },
    },
    limit: 2,
    fields: [
      'id',
      'slug',
      'title',
      'status',
      'content',
      'categories',
      'date_created',
      'short_content',
      'featured_image',
      'primary_category',
    ],
  });

  const tags = await tagService.readByQuery({
    fields: ['id', 'name'],
  });

  return {
    pageContext: {
      pageProps: {
        category: search?.category,
        searchText: search?.sq,
        tag: search?.tag,
        blogsAggregate,
        featuredPosts,
        searchPosts,
        categories,
        posts,
        tags,
      },
    },
  };
};
