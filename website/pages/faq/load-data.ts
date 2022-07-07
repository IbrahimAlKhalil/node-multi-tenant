import { ItemService } from '#types/item-service';

export async function loadData(
  service: ItemService,
  page: number,
  search = '',
) {
  if (search) {
    return {
      questions: await service.readByQuery({
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
      }),
    };
  }

  const questionsAggregate = await service.readByQuery({
    aggregate: {
      count: ['*'],
    },
  });
  const questions = await service.readByQuery({
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

  return {
    count: questionsAggregate[0].count,
    questions,
  };
}
