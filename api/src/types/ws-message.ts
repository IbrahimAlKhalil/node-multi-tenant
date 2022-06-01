type MessageType = 'sub' | 'req' | 'evt';

interface EvtMessage<T> {
  name: string;
  type: T;
  data?: any;
}

interface ReqSubMessage<T> extends EvtMessage<T> {
  id: number;
}

export type WsMessage<T extends MessageType = MessageType> = T extends 'evt'
  ? EvtMessage<T>
  : T extends 'req' | 'sub'
  ? ReqSubMessage<T>
  : never;
