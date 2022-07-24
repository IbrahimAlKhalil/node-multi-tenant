/* eslint-disable @typescript-eslint/no-empty-interface */

import { user_kind } from '../../prisma/client';
import { Session } from './session';

/**
 * Custom properties on the websocket object
 */

declare module 'hyper-express' {
  export interface Websocket {
    get context(): Session<user_kind>;
    session: Session<user_kind>;
  }
}
