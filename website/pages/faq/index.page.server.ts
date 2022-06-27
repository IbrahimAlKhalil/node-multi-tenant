import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';
import url from 'url';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const queryObj = url.parse(pageContext.url, true);
  const page = Number(queryObj.query?.page);
  const search =
    typeof queryObj.query?.sq === 'object' &&
    queryObj.query?.sq instanceof Array
      ? queryObj.query?.sq.toString()
      : queryObj.query?.sq;
  const questionService = new ItemsService('question', {
    schema: (pageContext as any)?.schema,
  });

  const questionsAggregate = await questionService.readByQuery({
    aggregate: {
      count: ['*'],
    },
  });

  const questions = await questionService.readByQuery({
    limit: 10,
    page,
    fields: [
      'id',
      'title',
      'slug',
      'content',
      'user.*',
      'priorities',
      'categories',
      'is_featured',
    ],
  });

  const questionsBySearch = await questionService.readByQuery({
    search: search,
    fields: [
      'id',
      'title',
      'slug',
      'content',
      'user.*',
      'priorities',
      'categories',
      'is_featured',
    ],
  });

  return {
    pageContext: {
      pageProps: {
        questionsAggregate,
        searchText: search,
        isSticky: !!search,
        questionsBySearch,
        questions,
      },
    },
  };
};
