import { ModelNames } from './types/model-names';
import { Injectable } from '@nestjs/common';
import { Model } from './types/model';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

@Injectable()
export class PermissionService {
  constructor() {
    this.loadModels();
  }

  public models: Partial<Record<ModelNames, Model<any, ModelNames>>> = {};
  public i18nModels: Partial<
    Record<ModelNames, { name: ModelNames; model: Model<any, ModelNames> }>
  > = {};

  private async loadModels() {
    const files = (
      await fs.readdir(path.resolve(__dirname, './models'))
    ).filter((file) => file.endsWith('.js'));
    const regex = /-([a-z])/g;

    for (const file of files) {
      const model = await import(path.resolve(__dirname, './models', file));
      const name = file
        .replace('.js', '')
        .replace(regex, (match, letter) => letter.toUpperCase());

      this.models[name as ModelNames] = model.default;
    }

    for (const [name, model] of Object.entries(this.models)) {
      if (!name.endsWith('I18n')) {
        continue;
      }

      this.i18nModels[name.replace('I18n', '') as ModelNames] = {
        name: name as ModelNames,
        model,
      };
    }
  }
}
