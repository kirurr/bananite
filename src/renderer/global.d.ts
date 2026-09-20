import type { HandlerMap } from '../main/ipc';

// A .d.ts emits nothing, so main-process types cannot leak into the bundle.
// Keep it a .d.ts.

// Same arguments, result wrapped in a Promise: it crosses ipcRenderer.invoke.
type Remote<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => Promise<Awaited<R>>
    : never;
};

declare global {
  interface Window {
    api: { [N in keyof HandlerMap]: Remote<HandlerMap[N]> };
  }
}

export {};
