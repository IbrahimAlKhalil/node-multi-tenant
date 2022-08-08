export interface CtxMenuContext<T = unknown> {
  position: {
    x: number;
    y: number;
  };
  target: Element;
  value: T;

  [key: string]: unknown;
}
