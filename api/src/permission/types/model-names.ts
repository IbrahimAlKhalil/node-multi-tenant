import { PrismaClient } from '../../../prisma/client';

export type ModelNames = keyof Omit<
  PrismaClient,
  | '$on'
  | '$transaction'
  | '$connect'
  | '$disconnect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$use'
>;
