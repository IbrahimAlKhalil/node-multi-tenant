import { PrismaClient, RoleCrudPermission } from '../../prisma/client';
import { ModelNames } from '../query/types/model-names';

export interface PrismaInstance {
  lastUsed: number;
  prisma: PrismaClient;
  rolePermissions?: Map<
    number,
    Partial<Record<ModelNames, RoleCrudPermission>>
  >;
}
