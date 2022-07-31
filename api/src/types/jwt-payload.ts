import { UserKind } from '../../prisma/client';

export interface JwtPayload {
  uid: number;
  iid: string;
  knd: UserKind;
  rol: number[];
  jti: number;
  exp: number;
}
