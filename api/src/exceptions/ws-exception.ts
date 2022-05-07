export class WsException extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}
