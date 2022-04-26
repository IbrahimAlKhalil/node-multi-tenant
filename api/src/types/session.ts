import { user_kind } from '../../prisma/client';

export interface Session {
  uid: number;
  iid: string;
  knd: user_kind;
  rol: number[];
  jti: number;
}
