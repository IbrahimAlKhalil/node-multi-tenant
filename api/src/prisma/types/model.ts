import { Field } from './field';

export interface Model {
  name: string;
  fields: Field[];
  uniqueFields: string[][];
  primaryKey: string[];
  scalarFields: string[];
  foreignFields: string[];
  scalarFieldsSet: Set<string>;
}