import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WsEvent } from '../types/ws-event';

@Injectable()
export class QueryListener {
  @OnEvent('query')
  async onQuery({ ws, data }: WsEvent) {
    // TODO: Implement query
  }
}
