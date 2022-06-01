import { PermissionDefinition as CreatePermission } from './create-permission';
import { PermissionDefinition as UpdatePermission } from './update-permission';
import { PermissionDefinition as DeletePermission } from './delete-permission';
import { MutationType } from '../schema/mutation-schema';
import { Model } from '../../prisma/types/model';
import { RelationAnalyzed } from './relation';
import { ModelNames } from './model-names';
import { ObjectSchema } from 'joi';

export interface Parent {
  relation: RelationAnalyzed;
  mutation: Mutation<Exclude<MutationType, 'delete' | 'deleteMany'>>;
}

export interface Mutation<M extends MutationType = MutationType> {
  type: M;
  target: ModelNames;
  model: Model;
  permission: {
    create?: CreatePermission<any, any, 'processed'> | true;
    update?: UpdatePermission<any, any, 'processed'> | true;
    delete?: DeletePermission<any, 'processed'> | true;
  };
  query: Record<string, any>;
  oldData: Record<string, any> | null;
  newData: Record<string, any> | null;
  schema?: ObjectSchema;
  parents?: Parent[];
}
