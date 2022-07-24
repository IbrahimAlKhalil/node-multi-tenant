import { MinioService } from '../minio/minio.service.js';
import { Institute } from '../types/institute';
import { Config } from '../config/config.js';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class InstituteService {
  constructor(
    private readonly minioService: MinioService,
    private readonly config: Config,
  ) {
    this.logger.log('Loading institutes...');
    this.loadInstitutes()
      .then(this.ensureMinioBuckets.bind(this))
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

  private async loadInstitutes(): Promise<Institute[]> {
    const { default: got } = await import('got');

    const host = `https://${this.config.app.websiteHost}`;
    const path = `/items/institute?access_token=${this.config.app.clusterSecret}&&filter[cluster][id][_eq]=${this.config.app.clusterId}&fields=id,cluster,name,slug,database&alias[id]=code`;
    const endpoint = `${host}${path}`;
    const response: Record<string, any> = await got
      .get(endpoint, {
        https: {
          rejectUnauthorized: this.config.app.env === 'production',
        },
      })
      .json();

    const institutes: Institute[] = response.data;

    for (const institute of institutes) {
      this.institutes[institute.id] = institute;
    }

    return institutes;
  }

  private async ensureMinioBuckets(
    institutes: Institute[],
  ): Promise<Institute[]> {
    for (const institute of institutes) {
      const bucketName = `qmmsoft-${institute.id}`;

      if (await this.minioService.bucketExists(bucketName)) {
        continue;
      }

      await this.minioService.makeBucket(bucketName, 'ap-southeast-1');
    }

    return institutes;
  }
}
