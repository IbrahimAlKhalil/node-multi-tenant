import { OnBeforeRender } from '#types/on-before-render';
import { ItemsService } from 'directus';

export { onBeforeRender };

const onBeforeRender: OnBeforeRender = async (pageContext) => {
  const questionService = new ItemsService('question', {
    schema: (pageContext as any)?.schema,
  });

  const questions = await questionService.readByQuery({
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

  console.log(questions);

  return {
    pageContext: {
      pageProps: {
        questions,
      },
    },
  };
};
