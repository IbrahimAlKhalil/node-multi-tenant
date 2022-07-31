import { UserKind } from '../../prisma/client';

export type UserKindExtra = UserKind | 'PUBLIC';

interface SessionBase<K extends UserKindExtra = UserKindExtra> {
  iid: string;
  knd: K;
}

interface SessionAuthenticated extends SessionBase<UserKind> {
  uid: number;
  rol: number[];
  jti: number;
}

export type Session<K extends UserKindExtra = UserKindExtra> = K extends 'PUBLIC'
  ? SessionBase<K>
  : SessionAuthenticated;
