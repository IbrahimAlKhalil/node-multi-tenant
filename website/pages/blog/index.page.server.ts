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
    'tags.*',
    'title',
    'status',
    'content',
    'categories',
    'date_created',
    'short_content',
    'featured_image',
    'primary_category',
  ];
  // Filter configuration
  const postFilterScaffolding: any = {};
  postFilterScaffolding.fields = postFields;
  if (search?.sq) {
    postFilterScaffolding.search = search.sq;
  }

  const filterScaffolding: any = {};
  filterScaffolding._and = [];

  if (search?.category) {
    filterScaffolding._and.push({
      categories: {
        post_category_id: {
          _eq: search.category,
        },
      },
    });
  }
  if (search?.tag) {
    filterScaffolding._and.push({
      tags: {
        tag_id: {
          _eq: search.tag,
        },
      },
    });
  }
  if (search?.category || search?.tag) {
    postFilterScaffolding.filter = filterScaffolding;
  }

  // blogsAggregate
  const blogsAggregate = await postService.readByQuery({
    ...postFilterScaffolding,
    aggregate: {
      count: ['*'],
    },
  });

  const categories = await postCategoryService.readByQuery({
    fields: ['id', 'name', 'slug', 'posts', 'parent'],
  });
  const posts = await postService.readByQuery({
    ...postFilterScaffolding,
    sort: ['-date_created'],
    limit: 5,
    page: Number(search?.page) ?? 1,
  });
  // TODO: add category filter
  // TODO: add tag filter
  const searchPosts = await postService.readByQuery({
    filter: {
      _or: [
        {
          categories: {
            post_category_id: {
              _eq: search?.category ?? 0,
            },
          },
        },
        {
          tags: {
            tag_id: {
              _eq: search?.tag ?? 0,
            },
          },
        },
      ],
    },
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
        page: search?.page,
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
