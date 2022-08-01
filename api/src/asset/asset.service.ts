import { MJMLParsingOptions } from './types/mjml-parsing-options';
import { Injectable, Logger } from '@nestjs/common';
import template from 'lodash/template.js';
import memoize from 'lodash/memoize.js';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';
import mjml2html from 'mjml';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  public getStream(name: string): Readable {
    return fs.createReadStream(path.join(__dirname, '../../assets', name));
  }

  public async getBuffer(name: string): Promise<Buffer> {
    return fs.promises.readFile(path.join(__dirname, '../../assets', name));
  }

  public async getText(name: string): Promise<string> {
    return fs.promises.readFile(path.join(__dirname, '../../assets', name), {
      encoding: 'utf-8',
    });
  }

  private readonly getMjmlCompiled = memoize(
    async (name: string, options?: MJMLParsingOptions) => {
      const filePath = path.join(__dirname, '../../assets', name);
      const mjml = await fs.promises.readFile(filePath, 'utf-8');

      const result = mjml2html(mjml, {
        ...options,
        filePath,
        actualPath: filePath,
      });

      if (result.errors.length !== 0) {
        this.logger.error(result.errors);
      }

      return template(result.html, {
        sourceURL: filePath,
      });
    },
  );

  public async getMjml(
    name: string,
    options?: MJMLParsingOptions,
  ): Promise<string> {
    const compiled = await this.getMjmlCompiled(name, options);

    return compiled(options?.variables);
  }
}
