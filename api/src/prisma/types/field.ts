import { DMMF } from '../../../prisma/client/runtime';

export interface Field {
  kind: DMMF.FieldKind;
  name: string;
  isList: boolean;
  isRequired: boolean;
  type: string;
  relationFromFields?: string[];
  relationToFields?: any[];
  relationName?: string;
}