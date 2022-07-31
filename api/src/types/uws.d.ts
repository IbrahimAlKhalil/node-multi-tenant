/* eslint-disable @typescript-eslint/no-empty-interface */

import { UserKind } from '../../prisma/client';
import { Session } from './session';

/**
 * Custom properties on the websocket object
 */

declare module 'hyper-express' {
  export interface Websocket {
    get context(): Session<UserKind>;
    session: Session<UserKind>;
  }
}
