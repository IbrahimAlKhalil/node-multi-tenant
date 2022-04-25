import { Institute } from '../types/institute';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class InstituteService {
  constructor(private readonly config: Config) {
    this.logger.log('Loading institutes...');
    this.loadInstitutes()
      .then(() => {
        this.logger.log(
          `Loaded ${Object.keys(this.institutes).length} institutes`,
        );
      })
      .catch((e) => {
        this.logger.error(`Failed to load institutes: ${e.message}`);
      });
  }

  private logger = new Logger(InstituteService.name);
  public institutes: { [instituteId: string]: Institute } = {};

  private async loadInstitutes(): Promise<void> {
    const { default: got } = await import('got');

    const host = `https://${this.config.app.websiteHost}`;
    const path = `/api/institute/by-cluster-id/${this.config.app.clusterId}?secret=${this.config.app.clusterSecret}`;
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
}
