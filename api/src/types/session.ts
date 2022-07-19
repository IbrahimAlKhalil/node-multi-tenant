import { user_kind } from '../../prisma/client';

export type UserKind = user_kind | 'PUBLIC';

interface SessionBase<K extends UserKind = UserKind> {
  iid: string;
  knd: K;
}

interface SessionAuthenticated extends SessionBase<user_kind> {
  uid: number;
  rol: number[];
  jti: number;
}

export type Session<K extends UserKind = UserKind> = K extends 'PUBLIC'
  ? SessionBase<K>
  : SessionAuthenticated;
