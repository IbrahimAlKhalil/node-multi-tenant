import { Field } from './field';

export interface Model {
  name: string;
  fields: Field[];
  uniqueFields: string[][];
  primaryKey: string[];
}