import { ServerItemService } from '#modules/server-item-service';
import { ClientItemService } from '#modules/client-item-service';
import { usePageContext } from '#modules/use-page-context';
import { ItemService } from '#types/item-service';

export function useItem(collection: string): ItemService {
  if (!import.meta.env.SSR) {
    return new ClientItemService(collection);
  }

  const ctx = usePageContext();

  return new ServerItemService(
    collection,
    ctx.schema,
    ctx.directus.ItemsService,
  );
}
