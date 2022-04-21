import {
  AppOptions,
  HttpRequest,
  HttpResponse,
  ListenOptions,
  RecognizedString,
  TemplatedApp,
  us_listen_socket,
  WebSocketBehavior,
} from 'uWebSockets.js';

export class Uws implements TemplatedApp {
  listen(
    host: RecognizedString,
    port: number,
    cb: (listenSocket: us_listen_socket) => void,
  ): TemplatedApp;
  listen(port: number, cb: (listenSocket: any) => void): TemplatedApp;
  listen(
    port: number,
    options: ListenOptions,
    cb: (listenSocket: false | us_listen_socket) => void,
  ): TemplatedApp;
  listen(port: any, options: any, cb?: any): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  get(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  post(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  options(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  del(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  patch(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  put(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  head(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  connect(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  trace(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  any(
    pattern: RecognizedString,
    handler: (res: HttpResponse, req: HttpRequest) => void,
  ): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  ws(pattern: RecognizedString, behavior: WebSocketBehavior): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  publish(
    topic: RecognizedString,
    message: RecognizedString,
    isBinary?: boolean,
    compress?: boolean,
  ): boolean {
    throw new Error('Method not implemented.');
  }
  numSubscribers(topic: RecognizedString): number {
    throw new Error('Method not implemented.');
  }
  addServerName(hostname: string, options: AppOptions): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  removeServerName(hostname: string): TemplatedApp {
    throw new Error('Method not implemented.');
  }
  missingServerName(cb: (hostname: string) => void): TemplatedApp {
    throw new Error('Method not implemented.');
  }
}
