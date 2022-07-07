import { ItemsService } from 'directus';
import {
  ReadByQueryParams,
  CreateOneParams,
  ReadOneParams,
  ItemService,
} from '#types/item-service';
import qs from 'qs';

export class ClientItemService implements ItemService {
  constructor(private readonly collection: string) {}

  async createOne(
    ...args: CreateOneParams
  ): ReturnType<ItemsService['createOne']> {
    const query = qs.stringify(args[1]);
    const res = await fetch(`/items/${this.collection}?${query}`, {
      method: 'POST',
      body: JSON.stringify(args[0]),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return (await res.json()).data;
  }

  async readByQuery(
    ...args: ReadByQueryParams
  ): ReturnType<ItemsService['readByQuery']> {
    const query = qs.stringify(args[0]);
    const res = await fetch(`/items/${this.collection}?${query}`);

    return (await res.json()).data;
  }

  async readOne(...args: ReadOneParams): ReturnType<ItemsService['readOne']> {
    const query = qs.stringify(args[1]);
    const res = await fetch(`/items/${this.collection}/${args[0]}?${query}`);

    return (await res.json()).data;
  }
}
