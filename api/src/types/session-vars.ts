import { user_kind } from '../../prisma/client';

export interface SessionVars {
  uid: number;
  iid: string;
  knd: user_kind;
  rol: number[];
  jti: number;
}
