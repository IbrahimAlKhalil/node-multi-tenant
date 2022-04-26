import { ModelNames } from './types/model-names';
import { Model } from './types/model';

export function defineModel<M, N extends ModelNames>(
  model: Model<M, N>,
): Model<M, N> {
  return model;
}
