export class WsException extends Error {
  constructor(message: string, public code: string, public path?: string) {
    super(message);
  }
}
