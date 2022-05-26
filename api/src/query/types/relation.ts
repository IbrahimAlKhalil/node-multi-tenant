import { Field } from '../../prisma/types/field';
import { Model } from '../../prisma/types/model';
import { ModelNames } from './model-names';

export interface Relation {
  type: 'one' | 'many';
  target: ModelNames;
  model: Model;
  field: Field;
}

export interface FKeyHolder extends Relation {
  fieldsTo: string[];
  fieldsFrom: string[];
}

export interface RelationAnalyzed {
  left: Relation;
  right: Relation;
  fKeyHolder: FKeyHolder;
  nonFKeyHolder: Relation;
}
