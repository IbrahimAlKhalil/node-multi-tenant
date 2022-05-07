import { InstituteService } from '../institute/institute.service.js';
import { PrismaInstance } from '../types/prisma-instance';
import { PrismaClient } from '../../prisma/client';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { fileURLToPath } from 'url';
import sdk from '@prisma/sdk';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

@Injectable()
export class PrismaService {
  constructor(
    private readonly instituteService: InstituteService,
    private readonly config: Config,
  ) {
    // Remove old instances that are not used for a while
    setInterval(() => {
      const now = Date.now();

      for (const instituteId in this.instituteService.institutes) {
        if (this.instances.hasOwnProperty(instituteId)) {
          const instance = this.instances[instituteId];

          if (now - instance.lastUsed > this.config.prisma.maxAge) {
            delete this.instances[instituteId];
          }
        }
      }
    }, 5 * 60 * 1000);

    sdk.getDMMF({
      datamodelPath: path.join(__dirname, '../../prisma/schema.prisma'),
    }).then(schema => {
      this.schema = schema;
    });
  }

  private instances: { [instituteId: string]: PrismaInstance } = {};
  public schema: Awaited<ReturnType<typeof sdk.getDMMF>>;

  public async getPrisma(instituteId: string): Promise<PrismaClient | null> {
    // Check if the institute exists
    if (!this.instituteService.institutes.hasOwnProperty(instituteId)) {
      // Institute does not exist
      return null;
    }

    let prisma: PrismaClient;

    if (this.instances.hasOwnProperty(instituteId)) {
      // A prisma instance for this institute already exists
      // Return it

      const instance = this.instances[instituteId];
      instance.lastUsed = Date.now();
      prisma = instance.prisma;
    } else {
      // No prisma instance for this institute exists yet

      const { PrismaClient } = await import('../../prisma/client/index.js');
      const institute = this.instituteService.institutes[instituteId];
      const config = this.config.postgres;

      // Instantiate a new prisma instance
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${institute.database}`,
          },
        },
      });

      // Add the new prisma instance to the instances list
      this.instances[instituteId] = {
        lastUsed: Date.now(),
        prisma,
      };
    }

    return prisma;
  }
}
