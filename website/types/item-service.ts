import { ItemsService as Base } from 'directus/dist/services/items';

export type ReadOneParams = Omit<Parameters<Base['readOne']>, 2>;
export type ReadByQueryParams = Omit<Parameters<Base['readByQuery']>, 1>;
export type CreateOneParams = Omit<Parameters<Base['createOne']>, 1>;

export interface ItemService {
  readByQuery(query: ReadByQueryParams[0]): ReturnType<Base['readByQuery']>;

  readOne(
    key: ReadOneParams[0],
    query: ReadOneParams[1],
  ): ReturnType<Base['readOne']>;

  createOne(data: CreateOneParams[0]): ReturnType<Base['createOne']>;
}
