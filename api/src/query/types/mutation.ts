import { PermissionDefinition as CreatePermission } from './create-permission';
import { PermissionDefinition as UpdatePermission } from './update-permission';
import { PermissionDefinition as DeletePermission } from './delete-permission';
import { SingleMutationType } from '../schema/base-query';
import { Model } from '../../prisma/types/model';
import { RelationAnalyzed } from './relation';
import { ModelNames } from './model-names';

export interface Mutation {
  type: SingleMutationType;
  target: ModelNames;
  model: Model;
  permission: {
    create?: CreatePermission<any, any> | true;
    update?: UpdatePermission<any, any> | true;
    delete?: DeletePermission<any, any> | true;
  };
  query: Record<string, any>;
  oldData: Record<string, any> | null;
  newData: Record<string, any> | null;
  parents?: Mutation[];
  relation?: RelationAnalyzed;
  skipDuplicate?: boolean;
}
