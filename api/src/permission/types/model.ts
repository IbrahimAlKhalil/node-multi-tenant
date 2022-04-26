import { CreatePermission } from './create-permission';
import { UpdatePermission } from './update-permission';
import { DeletePermission } from './delete-permission';
import { ReadPermission } from './read-permission';
import { user_kind } from '../../../prisma/client';
import { ModelNames } from './model-names';
import { ObjectSchema } from 'joi';

interface Actions<M, N extends ModelNames> {
  read?: ReadPermission<M, N>;
  create?: CreatePermission<M, N>;
  update?: UpdatePermission<M, N>;
  delete?: DeletePermission<M, N>;
}

export interface Model<M, N extends ModelNames> {
  i18n?: boolean;
  schema?: ObjectSchema<M>;
  roles: Partial<Record<user_kind | 'COMMON', boolean | Actions<M, N>>>;
}
