import { PrismaInstance } from '../types/prisma-instance';
import { PrismaClient } from '../../prisma/client';
import { Institute } from '../types/institute';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  constructor(
    private readonly config: Config,
  ) {
    this.init();
  }

  private institutes: { [key: string]: Institute } = {};
  private instances: { [key: string]: PrismaInstance } = {};

  public async getPrisma(instituteId: string): Promise<PrismaClient> {
    let prisma: PrismaClient;

    if (this.instances.hasOwnProperty(instituteId)) {
      const instance = this.instances[instituteId];
      instance.lastUsed = Date.now();
      prisma = instance.prisma;
    } else {
      const { PrismaClient } = await import('../../prisma/client/index.js');
      const config = this.config.postgres;
      const institute = this.institutes[instituteId];

      prisma = new PrismaClient({
        datasources: {
          db: {
            url: `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${institute.database}`,
          },
        },
      });

      this.instances[instituteId] = {
        lastUsed: Date.now(),
        prisma,
      };
    }

    return prisma;
  }

  private async loadInstitutes() {
    const { default: got } = await import('got');

    const host = `https://${this.config.app.websiteHost}`;
    const path = `/api/institute/by-cluster-id/${this.config.app.clusterId}`;
    const endpoint = `${host}${path}`;

    const institutes: Institute[] = await got
      .get(endpoint, {
        https: {
          rejectUnauthorized: this.config.app.env === 'production',
        },
      })
      .json();

    for (const institute of institutes) {
      this.institutes[institute.id] = institute;
    }
  }

  private async init() {
    await this.loadInstitutes();

    // Remove old instances that are not used for a while
    setInterval(() => {
      const now = Date.now();

      for (const instituteId in this.institutes) {
        if (this.instances.hasOwnProperty(instituteId)) {
          const instance = this.instances[instituteId];

          if (now - instance.lastUsed > this.config.prisma.maxAge) {
            delete this.instances[instituteId];
          }
        }
      }
    }, 5 * 60 * 1000);
  }
}
