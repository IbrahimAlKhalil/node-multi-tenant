import { ItemService } from '#types/item-service';

export async function loadTutorials(service: ItemService) {
  return service.readByQuery({
    filter: {
      parent: {
        _null: true,
      },
    },
    fields: [
      'id',
      'title',
      'slug',
      'parent',
      'children.title',
      'children.slug',
      'children.children.title',
      'children.children.slug',
      'children.children.children.title',
      'children.children.children.slug',
    ],
  });
}
