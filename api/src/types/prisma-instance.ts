import { PrismaClient } from '../../prisma/client';

export interface PrismaInstance {
  lastUsed: number;
  prisma: PrismaClient;
}
