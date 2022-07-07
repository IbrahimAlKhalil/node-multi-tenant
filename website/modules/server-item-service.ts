import { AbstractServiceOptions } from 'directus/dist/types/services';
import { ItemsService } from 'directus';
import {
  ReadByQueryParams,
  CreateOneParams,
  ReadOneParams,
  ItemService,
} from '#types/item-service';

export class ServerItemService implements ItemService {
  constructor(
    private readonly collection: string,
    private readonly schema: AbstractServiceOptions['schema'],
    private readonly serviceClass: typeof ItemsService,
  ) {
    this.service = new serviceClass(collection, {
      schema: schema,
    });
  }

  private service: ItemsService;

  createOne(...args: CreateOneParams): ReturnType<ItemsService['createOne']> {
    return this.service.createOne(args[0]);
  }

  readByQuery(
    ...args: ReadByQueryParams
  ): ReturnType<ItemsService['readByQuery']> {
    return this.service.readByQuery(args[0], args[1]);
  }

  readOne(...args: ReadOneParams): ReturnType<ItemsService['readOne']> {
    return this.service.readOne(args[0], args[1]);
  }
}
