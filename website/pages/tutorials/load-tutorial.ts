import { ItemService } from '#types/item-service';

export function loadTutorial(service: ItemService, slug: string) {
  return service
    .readByQuery({
      filter: {
        slug: {
          _eq: slug,
        },
      },
      fields: ['id', 'status', 'title', 'slug', 'content'],
    })
    .then((t) => t[0]);
}
