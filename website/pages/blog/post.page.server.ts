import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const { search } = pageContext.urlParsed;
  console.log(pageContext.urlParsed);

  const postService = new ItemsService('post', {
    schema: (pageContext as any)?.schema,
  });

  const postReactionsService = new ItemsService('post_reaction', {
    schema: (pageContext as any)?.schema,
  });

  const reactionsService = new ItemsService('reaction', {
    schema: (pageContext as any)?.schema,
  });

  const commentsService = new ItemsService('comment', {
    schema: (pageContext as any)?.schema,
  });
  const commentsReactionsService = new ItemsService('comment_reaction', {
    schema: (pageContext as any)?.schema,
  });
  const commentsSuggestionService = new ItemsService('suggestion', {
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
      'user_created.avatar',
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
  const reactions = await reactionsService.readByQuery({});
  const postReactions = await postReactionsService.readByQuery({
    filter: {
      post: {
        _eq: post[0].id,
      },
    },
    fields: [
      'id',
      'user_created?.first_name',
      'user_created?.last_name',
      'user_created?.avatar',
      'user_created.email',
      'date_created',
      'reaction.value',
      'post.id',
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
      'user',
      'post',
      'institute.code',
      'institute.name',
      'institute.cluster.host',
      'parent',
      'mention',
      'reactions.reaction_id.value',
    ],
  });

  const commentsReactions = await commentsReactionsService.readByQuery({
    filter: {
      comment: {
        post: {
          _eq: post[0].id,
        },
      },
    },
    fields: [
      'id',
      // 'user_created.first_name',
      // 'user_created.last_name',
      // 'user_created.avatar',
      'date_created',
      'reaction.value',
      'comment.id',
      'comment.post.id',
    ],
  });

  const commentsSuggestions = await commentsSuggestionService.readByQuery({
    filter: {
      _or: [
        {
          post: {
            _null: true,
          },
        },
        {
          post: {
            _eq: post[0].id,
          },
        },
      ],
    },
  });

  console.log('comments data: ', comments);

  return {
    pageContext: {
      pageProps: {
        suggestions: commentsSuggestions,
        postId: post[0].id,
        commentsReactions,
        post: post[0],
        postReactions,
        reactions,
        comments,
      },
    },
  };
};
