import { usePageContext } from '#modules/use-page-context';
import { ItemsService } from 'directus';

export function useServerItem<T = Record<string, any>>(
  collection: string,
): ItemsService<T> {
  if (!import.meta.env.SSR) {
    throw new Error(
      '"useServerItems" is not meant to be used on the client side',
    );
  }

  const ctx = usePageContext();

  return new ctx.directus.ItemsService<T>(collection, {
    schema: ctx.schema,
  });
}
