import { Session } from '../../types/session';
import { ModelNames } from './model-names';
import { FieldClass } from './field-class';
import { Actions } from './model';

export interface ClassifyOptions {
  model: ModelNames;
  fields?: string[];
  classes?: Partial<Record<FieldClass, true>>;
  session?: Session;
  action?: Exclude<keyof Actions<any>, 'subscribe' | 'delete'>;
}
