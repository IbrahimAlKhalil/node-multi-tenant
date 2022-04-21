import { PrismaClient } from '@prisma/client';

const { env } = process;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${
        env.POSTGRES_HOST
      }:${env.POSTGRES_PORT}/${
        env.WEBSITE_POSTGRES_DATABASE ?? env.POSTGRES_DATABASE ?? 'website'
      }`,
    },
  },
});
