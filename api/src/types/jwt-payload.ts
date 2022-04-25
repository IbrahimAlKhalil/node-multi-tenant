import { user_kind } from '../../prisma/client';

export interface JwtPayload {
  uid: number;
  iid: string;
  knd: user_kind;
  cst: string;
  jti: number;
  exp: number;
}
