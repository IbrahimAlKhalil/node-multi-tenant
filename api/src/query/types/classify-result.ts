import { ClassifyOptions } from './classify-options';

export type ClassifyResult<O extends ClassifyOptions> = Record<
  keyof O['classes'],
  string[]
>;
